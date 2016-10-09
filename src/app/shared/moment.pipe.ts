import {Pipe, PipeTransform} from "@angular/core";
import moment = require("moment");

/*
 * calls moment for date formatting
 * Usage:
 *   value | moment
 * Example:
 *   {{ purchaseDate |  moment}}
 *   formats to: moment(purchaseDate).fromNow()
*/
@Pipe({ name: "gbgMoment", pure: true })
export class MomentPipe implements PipeTransform {
    public transform(value: Date): string {

        if (value === null) {
            return null;
        }

        return moment(value).fromNow();
    }
}
