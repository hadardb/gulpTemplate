/*
 * @name: 文件
 * @Author: Haojin Sun
 * @Date: 2020-01-04 16:38:13
 * @LastEditors  : Haojin Sun
 * @LastEditTime : 2020-01-04 22:57:05
 */
let addchange = {
    '1': ['7'],
    '3': ['9'],
    '5': ['6', '9'],
    '6': ['8'],
    '9': ['8'],
    '-': ['+'],
    '0': ['8']
}

let delchange = {
    '6': ['5'],
    '7': ['1'],
    '8': ['6', '9'],
    '9': ['5', '3'],
    '+': ['-','1']
}

let changeMe = {
    '2': ['3'],
    '3': ['5', '2'],
    '5': ['3'],
    '6': ['9'],
    '9': ['6'],
    '0':['6','9']
}

var val = document.getElementById('val')
var btn = document.getElementById('btn')
btn.addEventListener('click', function(){
    let outVlaue = moveFire(val.value)
    for(let i of outVlaue){
        let dom = document.createElement('div')
        dom.innerText = i
        document.getElementById('answer').appendChild(dom)
    }
})


function moveFire(value, double = true) {
    let myStr =new Set()
    // 1. 对字符串进行遍历
    for (let i = 0; i < value.length; i++) {
        // 2. 将每个字符与转换对象进行对比  能够转换则尝试输出是否正确
        let word = value.charAt(i)
        // 2.1 自身是否可变
        if (changeMe[word]) {
            let arr = changeMe[word]
            // 2.1.1 将其变为新的等式 并计算是否正确
            let newStr = changeStr(arr, value, i)
            if (newStr) myStr.add(newStr) 
        }
        // 2.2 自身减少一根 并对其他字符进行加一根操作 
        if (delchange[word]) {
            let arr = delchange[word]
            // 2.2.1 将其变为新的等式 并计算是否正确
            for (let j = 0; j < arr.length; j++) {
                // 2.2.2 将自身变成少一根的字符
                let newStr = setStr(value, i, arr[j])
                // 2.2.3 将其他字符增加一根 如果成立就输出
                let addStr = addChangeStr(newStr, i)
                if (addStr) myStr.add(addStr) 
                //开启double 则考虑多+10、+100等情况
                if (double) {
                    for (let p = 0; p < newStr.length; p++) {
                        let doubleStr = addWordInStr(newStr,p,1)
                        if(ohYes(doubleStr))  myStr.add(doubleStr)   
                    }
                }
            }
        }
    }
    if (myStr.length == 0) return '没有找到正确答案'
    else return myStr
}

/**
 * @name: 根据下标对字符串进行单个字符的增加
 * @str {string}    原始字符串
 * @index {number}     需要被新增的下标
 * @newWord {string}   需要新增的字符
 * @return: {string}    新的字符串
 */
function addWordInStr(str, index, newWord) {
    let newStr = ''
    for (let i = 0; i < str.length; i++) {
        if (i == index) {
            newStr += newWord
        }
        newStr += str.charAt(i)
    }
    return newStr
}

/**
 * @name: 对字符串剩余字符进行替换加的运算
 * @str {string}    原始字符串
 * @index {Number}    当前被增加了的字符串下标（即不能被剪的字符串）
 * @return: {string || null} 成功返回该字符串否则返回null
 */
function addChangeStr(str, index) {
    let newStr
    for (let i = 0; i < str.length; i++) {
        // 当前的字符
        let word = str.charAt(i)
        // 对应del对象的值
        let addArr = addchange[word]
        if (i == index || word == '=') continue
        // 如果存在 则替换并查看是否是等式
        if (addArr) {
            newStr = changeStr(addArr, str, i)
            if (newStr) return newStr
        }
    }
    return newStr
}

/** 
 * @name: 改变自身判断等式是否成立
 * @arr {Array}     可改变字符串的数组
 * @str {string}       原始字符串
 * @index {number}       需要被替换的字符串下标
 * @return: {string || null}    成功返回该字符串否则返回null
 */
function changeStr(arr, str, index) {
    for (let j = 0; j < arr.length; j++) {
        let newStr = setStr(str, index, arr[j])
        if (ohYes(newStr)) return newStr
    }
    return null
}


/**
 * @name: 根据下标对字符串进行单个字符的替换
 * @str {string}    原始字符串
 * @index {number}     需要被替换的字符串下标
 * @newWord {string}   需要替换的字符
 * @return: {string}    新的字符串
 */
function setStr(str, index, newWord) {
    let newStr = ''
    for (let i = 0; i < str.length; i++) {
        if (i == index) {
            newStr += newWord
        } else {
            newStr += str.charAt(i)
        }
    }
    return newStr
}

/**
 * @name:  判断等式是否相等
 * @str {string}   等式字符串
 * @return: true||false
 */
function ohYes(str) {
    let arr = str.split('=')
    if (eval(arr[0]) == eval(arr[1])) {
        return true
    } else return false
}