import { InMemoryDbService } from 'angular-in-memory-web-api';

export class InMemoryDataService implements InMemoryDbService {
    createDb() {
        let habits = [
            {
                'name': 'daily javascript',
                'description': 'practice makes perfect!',
                'date_added': '2016-09-02'
            },
            {
                'name': 'no alcohol',
                'description': 'cause it totally depresses you, man...',
                'date_added': '2016-08-29'
            },
            {
                'name': 'no caffeine',
                'description': 'no a single drop of caffeine! this will help with energy, testosterone, adrenals, etc...',
                'date_added': '2016-08-29'
            },
            {
                'name': 'noM',
                'description': 'because it lowers testosterone',
                'date_added': '2016-08-29'
            }
        ];

        let details = [
            {
                'name': 'no alcohol',
                'date': '2016-09-05',
                'status': '0'
            },
            {
                'name': 'no alcohol',
                'date': '2016-09-06',
                'status': '1'
            },
            {
                'name': 'no alcohol',
                'date': '2016-09-07',
                'status': '1'
            },
            {
                'name': 'daily javascript',
                'date': '2016-11-02',
                'status': '0'
            },
            {
                'name': 'daily javascript',
                'date': '2016-11-22',
                'status': '1'
            },
            {
                'name': 'daily javascript',
                'date': '2016-11-23',
                'status': '1'
            }
        ];

        return { habits, details };
    }

}
