import {TagDate} from '../../classes/tagdate'
/**
 * 
 * @param arr 
 * @param i 
 * @param j 
 */
function tswap(arr:TagDate[], i:number, j:number) {
    var x:TagDate = arr[i];
    arr[i] = arr[j];
    arr[j] = x;
}

// arr = array of integers
// s = start index = 0
// e = end index
//returns - partitionIndex = index of the partition variable after the partition is performed - required by quicksort
/**
 * 
 * @param arr the array to be partitioned
 * @param s where to start evaluating the array (usually 0 i.e. the start index)
 * @param e where to end evaluating the array (usually array.length-1 i.e. the end index)
 */
function tpartition(arr:TagDate[], s:number, e:number): number {
    var a:TagDate[] = arr;
    var start:number = s;
    var end:number = e;
    var pivot:TagDate = a[end];
    var i: number = start - 1;//partion index

    for(var j = start; j < end ; j++ ) {//must stop one less than end index
        if (a[j].btime >= pivot.btime) {
            i++;
            tswap(a, i, j);
        }
    }
    tswap(a ,i+1, end);//partition index value with pivotIndex value
    return i+1;
}

//repetedly calls partition around a pivot points in order to sort arr elements

/**
 * @param arr array of EntryDates to sort
 * @param start where the sorts from in the array
 * @param end where the sorts end in the array
 */
export function sort(arr:TagDate[], start:number, end:number):TagDate[] {
    var a:TagDate[] = arr;
    if (start < end){
        var partitionIndex = tpartition(a, start, end);
        sort(a, start, partitionIndex-1);
        sort(a, partitionIndex+1, end);
    }
    return a;
}