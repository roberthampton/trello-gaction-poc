const { conversation } = require('@assistant/conversation');
const functions = require('firebase-functions');
const axios = require('axios');

var currBoard = "";

const app = conversation();

const result = (url) => {
  const request = axios.get(url);

  return request
    .then(result => { console.log(result); return result; })
    .catch(error => { console.error(error); return Promise.reject(error); });
};

app.handle('getLabels', (conv) => {
  url = 'https://api.trello.com/1/boards/5vR2ckAd/labels?key=ce7280152d3a3e7f415d96ef4a01c397&token=dbd71e0fd7f8368722544a13d36de60500d6e7bbe297a7007bba66c675aabd08';
  return result(url).then((labelResponse) => {
    labelList = labelResponse.data;
    var labelCount = 0;
    var labelsExplanation = "";
    for(var i = 0; i < labelList.length; i++) { 
      if(labelList[i].name != "") {
        labelCount++;
      	labelsExplanation += `${labelList[i].name} which is represented by the colour ${labelList[i].color}. \n`;
      }
    }
    conv.add(`The board has the following ${labelCount} labels:`);
    conv.add(labelsExplanation);
  });
});

app.handle('getLists', (conv) => {
  url = 'https://api.trello.com/1/boards/5vR2ckAd/lists?key=ce7280152d3a3e7f415d96ef4a01c397&token=dbd71e0fd7f8368722544a13d36de60500d6e7bbe297a7007bba66c675aabd08';
  return result(url).then((listResponse) => {
    listList = listResponse.data;
    var listCount = 0;
    var listNames = "";
    for(var i = 0; i < listList.length; i++) { 
        listCount++;
      	listNames += `${listList[i].name},\n`;
  	}
    conv.add(`The board has the following ${listCount} lists:`);
    conv.add(listNames);
  });
});

exports.ActionsOnGoogleFulfillment = functions.https.onRequest(app);
