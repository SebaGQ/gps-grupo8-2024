import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'dayTranslate'
})
export class DayTranslatePipe implements PipeTransform {

  private daysMap: { [key: string]: string } = {
    monday: 'lunes',
    tuesday: 'martes',
    wednesday: 'miércoles',
    thursday: 'jueves',
    friday: 'viernes',
    saturday: 'sábado',
    sunday: 'domingo'
  };

  transform(value: string): string {
    return this.daysMap[value.toLowerCase()] || value;
  }
}
