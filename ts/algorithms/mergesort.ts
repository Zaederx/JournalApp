/**
 * MergeSort - ascending order - smallest to biggest
 */
export function mergeSort(arr:number[]) {
    if (arr.length < 2) {
        return arr
    }
    const a1:number[] = arr.slice(0,arr.length/2)
    const a2:number[] = arr.slice(arr.length/2, arr.length)
    console.log('a1:',a1)
    console.log('a2:',a2)
    const sorted1:number[] = mergeSort(a1)
    const sorted2:number[] = mergeSort(a2)
    return merge(sorted1,sorted2)
}

function merge(a1:any[],a2:any[]) {
    console.log('merge called')
    var i = 0
    var j = 0
    var arr:any[] = []
  
    //which is bigger add to arr and remove from a1 or a2    
    while (a1.length && a2.length) {
        arr.push(a1[0] < a2[0] ? a1.shift() : a2.shift())
    }

    //which ever a has some left add to arr
    while (a1.length) {
        arr.push(a1.shift())
    }
    while (a2.length) {
        arr.push(a2.shift())
    }
    return arr
}

