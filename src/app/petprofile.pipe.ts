import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'petprofile'
})
export class PetprofilePipe implements PipeTransform {

  transform(value: any, ...args: any[]): any {
    return null;
  }

}
