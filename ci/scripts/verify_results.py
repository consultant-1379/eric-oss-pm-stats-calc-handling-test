import json
import logging

f = open('summary.json')
data = json.load(f)

print("Begin verifying the results")

for i in data['root_group']['groups']:
    for f in data['root_group']['groups'][i]['groups']:
        for j in data['root_group']['groups'][i]['groups'][f]['checks']:
            for g in data['root_group']['groups'][i]['groups'][f]['checks'][j]:
                if g == 'passes':
                    number_of_passed_tests = data['root_group']['groups'][i]['groups'][f]['checks'][j]['passes']
                    if number_of_passed_tests == 0:
                        exit(-1)
                if g == 'fails':
                    number_of_failed_tests = data['root_group']['groups'][i]['groups'][f]['checks'][j]['fails']
                    if number_of_failed_tests != 0:
                        exit(-1)
