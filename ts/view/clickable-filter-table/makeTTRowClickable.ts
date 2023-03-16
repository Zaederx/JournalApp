import { plain, highlighted, clicked } from './constants'
 /**
  * 
  * @param row HTMLTableRowElement
  */
export default function makeTTRowClickable(row:HTMLTableRowElement) {
    console.log('function makeTTRowClickable called')
    console.log('\n\n\n\n\n**********row:'+row+'*************\n\n\n\n\n\n\n');
    //constants
    //add css class
    row.className = 'table-row'
    //if mouse goes over row - highlight it yellow
    row.addEventListener('mouseover', function (event) {
        console.log('mouseover:'+ highlighted);
        if (row.style.backgroundColor == clicked) {console.log('backgroundColor == clicked');row.style.backgroundColor = clicked;}
        else {
            row.style.backgroundColor = (row.style.backgroundColor != clicked && row.style.backgroundColor != highlighted) ?  highlighted : row.style.backgroundColor;
        }
    });
    //if mouse leaves row - unhighlight it
    row.addEventListener('mouseleave',function(event) {
        console.log('left:'+plain);
        console.log('\n\n\n\n\n**********row:'+row.style.backgroundColor+'*************\n\n\n\n\n\n\n')
        if (row.style.backgroundColor == clicked) {console.log('backgroundColor == clicked');row.style.backgroundColor = clicked;}
        else {row.style.backgroundColor = row.style.backgroundColor == highlighted ?  plain: row.style.backgroundColor;}
    });
    //if row is clicked - highlight if red
    row.addEventListener('click',function(event) {
        console.log('clicked:'+clicked);
        row.style.backgroundColor = row.style.backgroundColor != clicked ? clicked : plain;
    });
 }
 