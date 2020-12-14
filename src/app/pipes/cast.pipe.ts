import { Pipe, PipeTransform } from '@angular/core';
import { UserModel } from '../models/user.model';

@Pipe({
  name: 'cast',
  pure: true
})
export class CastPipe implements PipeTransform {

  constructor() {
  }

  transform(value: any, args?: any) {
    return value as UserModel;
  }
}
