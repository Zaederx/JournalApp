/**
 * Functions for performing sorting on biarrays instead of 
 * single arrays.
 */

/**
 * 
 * @param arr 
 * @param i 
 * @param j 
 */
function biswap(arr:[string & number[]], i:number, j:number) {
    var x:string&number[] = arr[i];
    arr[i] = arr[j];
    arr[j] = x;
}

// arr = array of integers
// s = start index = 0
// e = end index
//returns - partitionIndex = index of the partition variable after the partition is performed - required by quicksort
function bipartition(arr:[string & number[]], s:number, e:number): number {
    var a:[string & number[]] = arr;
    var start:number = s;
    var end:number = e;
    var pivot:number = a[end][1];
    var i: number = start - 1;

    for(var j = start; j < end - 1; j++ ) {
        if (a[j][1] <= pivot) {
            i++;
            biswap(a, i, j);
        }
    }
    biswap(a ,i+1, end);
    return i+1;
}

//repetedly calls partition around a pivot points in order to sort arr elements
function sort(arr:[string & number[]], start:number, end:number):[string & number[]] {
    var a:[string & number[]] = arr;
    if (start < end){
        var partitionIndex = bipartition(a, start, end);
        sort(a,start,partitionIndex-1);
        sort(a, partitionIndex+1, end);
    }
    return a;
}