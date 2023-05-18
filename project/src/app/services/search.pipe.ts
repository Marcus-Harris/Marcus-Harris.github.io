// import { Pipe, PipeTransform } from '@angular/core';
// import { MatTableDataSource } from '@angular/material/table';
// import { Investment } from '../models/investment';

// @Pipe({
//   name: 'search'
// })
// export class SearchPipe implements PipeTransform {

//   transform(value: MatTableDataSource<Investment>, keys: string, term: string) {
//     console.log(value);
//     console.log(keys + ' keys');
//     console.log(term + ' term');
//     if (!term) {
//       return value;
//     }
//     // return (value || []).filter((item: any) => keys.split(',').some(key => item.hasOwnProperty(key) && new RegExp(term, 'gi').test(item[key])));
//     return (value || [])._filterData();
//   }
// }