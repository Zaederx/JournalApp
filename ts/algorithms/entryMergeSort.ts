import { EntryDate } from "../classes/EntryDate"

/**
 * MergeSort - ascending order - smallest to biggest
 */
 export function mergeSort(arr:EntryDate[]) {
    if (arr.length < 2) {
        return arr
    }
    const a1:EntryDate[] = arr.slice(0,arr.length/2)
    const a2:EntryDate[] = arr.slice(arr.length/2, arr.length)
    console.log('a1:',a1)
    console.log('a2:',a2)
    const sorted1:EntryDate[] = mergeSort(a1)
    const sorted2:EntryDate[] = mergeSort(a2)
    return merge(sorted1,sorted2)
}

function merge(a1:EntryDate[],a2:EntryDate[]) {
    console.log('merge called')
    var i = 0
    var j = 0
    var arr:EntryDate[] = []
  
    //which is bigger add to arr and remove from a1 or a2    
    while (a1.length && a2.length) {
        arr.push(a1[0].btime > a2[0].btime ? a1.shift() as EntryDate : a2.shift() as EntryDate)
    }

    //which ever a has some left add to arr
    while (a1.length) {
        arr.push(a1.shift() as EntryDate)
    }
    while (a2.length) {
        arr.push(a2.shift() as EntryDate)
    }
    return arr
}

