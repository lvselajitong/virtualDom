import { StateEnums, isString, move } from './util'
import Element from './Element';

export default function diff(oldDomTree, newDomTree){
    let patchs = {};

    dfs(oldDomTree, newDomTree, 0, patchs);

    return patchs;
}
function dfs(oldNode, newNode, index, patches){
    let curPatches = [];

    if(!newNode){

    }else if(newNode.tag === oldNode.tag && newNode.key === oldNode.key){
        let props = diffProps(oldNode.props, newNode.props);
        if(props.length){
            curPatches.push({type: StateEnums.ChangeProps, props});
        }
        diffChildren(oldNode.children, newNode.children, index,patches)
    }else{
        curPatches.push({type:StateEnums.Replace, node: newNode})
    }

    if(curPatches.length){
        if(patches[index]){
            patches[index] = patches[index].concat(curPatches);
        }else{
            patches[index] = curPatches;
        }
    }
}
function diffProps(oldProps, newProps){
    //先遍历oldProps查看是否存在删除的属性
    //然后遍历newProps查看是否有属性值被修改
    //最后查看是否有属性新增
    let change = [];
    for(const key in oldProps){
        if(newProps.hasOwnProperty(key) && !newProps[key]){
            change.push({
                prop: key
            })
        }
    }
    for(const key in newProps){
        if(newProps.hasOwnProperty(key)){
            const prop = newProps[key];
            if(oldProps[key] && oldProps[key] !== newProps[key]){
                change.push({
                    prop: key,
                    value: newProps[key]
                })
            }else if(!oldProps[key]){
                change.push({
                    prop: key,
                    value: newProps[key]
                })
            }
        }   
    }
    return change
}
//判断列表的差异
function listDiff(oldList, newList, index, patches){
    let oldKeys = getKeys(oldList)
    let newKeys = getKeys(newList)

    let changes = []

    let list = []

    oldList && oldList.forEach(item=>{
        let key = item.key
        if(isString(item)){
                key = item
        }

        let index = newKeys.indexOf(key)
        if(index === -1){
                list.push(null)
        }else{
                list.push(key)
        }
    })
    let length = list.length;
    for(let i=length-1;i>=0;i--){
        if(!list[i]){
            list.splice(i,1);
            changes.push({
                type:StateEnums.Remove,
                index:i
            })
        }
    }
    newList && newList.forEach((item, i) => {
        let key = item.key
        if (isString(item)) {
            key = item
        }
        // 寻找旧的 children 中是否含有当前节点
        let index = list.indexOf(key)
        // 没找到代表新节点，需要插入
        if (index === -1 || key == null) {
            changes.push({
              type: StateEnums.Insert,
              node: item,
              index: i
            })
            list.splice(i, 0, key)
        } else {
            // 找到了，需要判断是否需要移动
            if (index !== i) {
              changes.push({
                type: StateEnums.Move,
                from: index,
                to: i
              })
              move(list, index, i)
            }
        }
    })

    return { changes, list }
}

function getKeys(list) {
    let keys = []
    let text
    list &&
      list.forEach(item => {
        let key
        if (isString(item)) {
          key = [item]
        } else if (item instanceof Element) {
          key = item.key
        }
        keys.push(key)
      })
    return keys
}


function diffChildren(oldChild, newChild, index, patches) {
    let { changes, list } = listDiff(oldChild, newChild, index, patches)
    if (changes.length) {
      if (patches[index]) {
        patches[index] = patches[index].concat(changes)
      } else {
        patches[index] = changes
      }
    }
    // 记录上一个遍历过的节点
    let last = null
    oldChild &&
      oldChild.forEach((item, i) => {
        let child = item && item.children
        if (child) {
          index =
            last && last.children ? index + last.children.length + 1 : index + 1
          let keyIndex = list.indexOf(item.key)
          let node = newChild[keyIndex]
          // 只遍历新旧中都存在的节点，其他新增或者删除的没必要遍历
          if (node) {
            dfs(item, node, index, patches)
          }
        } else index += 1
        last = item
      })
  }