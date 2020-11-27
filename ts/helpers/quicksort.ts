function swap(arr:number[], i:number, j:number) {
    var x:number = arr[i];
    arr[i] = arr[j];
    arr[j] = x;
}

// arr = array of integers
// s = start index = 0
// e = end index
//returns - partitionIndex = index of the partition variable after the partition is performed - required by quicksort
function partition(arr:number[], s:number, e:number): number {
    var a:number[] = arr;
    var start:number = s;
    var end:number = e;
    var pivot:number = a[end];
    var i: number = start - 1;

    for(var j = start; j < end - 1; j++ ) {
        if (a[j] <= pivot) {
            i++;
            swap(a, i, j);
        }
    }
    swap(a ,i+1, end);
    return i+1;
}

//repetedly calls partition around a pivot points in order to sort arr elements
function quicksort(arr:number[], start:number, end:number):number[] {
    var a:number[] = arr;
    if (start < end){
        var partitionIndex = partition(a, start, end);
        quicksort(a,start,partitionIndex-1);
        quicksort(a, partitionIndex+1, end);
    }
    return a;
}