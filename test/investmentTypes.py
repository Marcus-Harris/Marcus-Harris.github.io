import requests
import json

INVESTMENT_TYPE_ENDPOINT = "https://localhost:7160/api/InvestmentType"
HISTORY_ENDPOINT = "https://localhost:7160/api/History"

token = "auth-token"

requestHeaders = {
  'accept': 'text-plain',
  'Authorization': 'Bearer {}'.format(token),
  'Content-Type': 'application/json'
}

## GET ALL TEST ##
response = requests.get(INVESTMENT_TYPE_ENDPOINT, headers=requestHeaders, verify=False)
investmentTypes = response.json()

length = len(investmentTypes)
assert response.status_code == 200



## CREATE TEST ##
param = {
  "id": 0,
  "type": "TESTING"
}

response = requests.post(INVESTMENT_TYPE_ENDPOINT, data=json.dumps(param), headers=requestHeaders, verify=False)

investmentTypes = response.json()
newestID = investmentTypes[length]["id"]

assert response.status_code == 200

historyResponse = requests.get(HISTORY_ENDPOINT, headers=requestHeaders, verify=False)
assert historyResponse.status_code == 200

history = historyResponse.json()
historyLength = len(history)

assert history[historyLength - 1]["entry"] == "TESTING has been added as a type."
latestHistoryID = history[historyLength - 1]["id"]


historyResponse = requests.delete(HISTORY_ENDPOINT + "/" + str(latestHistoryID), headers=requestHeaders, verify=False)
assert historyResponse.status_code == 200



## EDIT TEST ##
param = {
  "id": newestID,
  "type": "TEST"
}

response = requests.put(INVESTMENT_TYPE_ENDPOINT, data=json.dumps(param), headers=requestHeaders, verify=False)

historyResponse = requests.get(HISTORY_ENDPOINT, headers=requestHeaders, verify=False)
assert historyResponse.status_code == 200

history = historyResponse.json()
historyLength = len(history)

assert history[historyLength - 1]["entry"] == "TESTING has been renamed as TEST."

latestHistoryID = history[historyLength - 1]["id"]

historyResponse = requests.delete(HISTORY_ENDPOINT + "/" + str(latestHistoryID), headers=requestHeaders, verify=False)
assert historyResponse.status_code == 200



## GET ONE TEST ##
response = requests.get(INVESTMENT_TYPE_ENDPOINT + "/" + str(newestID), headers=requestHeaders, verify=False)
assert response.status_code == 200

test = response.json()

assert test["type"] == "TEST"



## DELETE TEST ##
response = requests.delete(INVESTMENT_TYPE_ENDPOINT + "/" + str(newestID), headers=requestHeaders, verify=False)
assert response.status_code == 200

historyResponse = requests.get(HISTORY_ENDPOINT, headers=requestHeaders, verify=False)
assert historyResponse.status_code == 200

history = historyResponse.json()
historyLength = len(history)

assert history[historyLength - 1]["entry"] == "TEST has been deleted as a type."

latestHistoryID = history[historyLength - 1]["id"]

historyResponse = requests.delete(HISTORY_ENDPOINT + "/" + str(latestHistoryID), headers=requestHeaders, verify=False)
assert historyResponse.status_code == 200

print("INVESTMENT TYPE TEST COMPLETED SUCCESSFULLY")