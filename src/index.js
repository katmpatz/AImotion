   
import '@marcellejs/core/dist/marcelle.css';
import {
  batchPrediction,
  datasetBrowser,
  datasetTable,
  button,
  confusionMatrix,
  dashboard,
  dataset,
  dataStore,
  mlpClassifier,
  mobileNet,
  modelParameters,
  confidencePlot,
  trainingProgress,
  textInput,
  toggle,
  trainingPlot,
  webcam,
  throwError,
} from '@marcellejs/core';

// -----------------------------------------------------------
// INPUT PIPELINE & DATA CAPTURE
// -----------------------------------------------------------

const input = webcam();
const featureExtractor = mobileNet();

const label = textInput();
label.title = 'Instance label';
const capture = button('Hold to record instances');
capture.title = 'Capture instances to the training set';

const store = dataStore('http://localhost:3030');
const trainingSet = dataset('training-set-dashboard', store);
const trainingSetBrowser = datasetBrowser(trainingSet);

input.$images
  .filter(() => capture.$pressed.value)
  .map((x) => ({ x, y: label.$value.value, thumbnail: input.$thumbnails.value}))
  .subscribe(trainingSet.create.bind(trainingSet));

// -----------------------------------------------------------
// TRAINING
// -----------------------------------------------------------

const b = button('Train');
b.title = 'Training Launcher';
const classifier = mlpClassifier({ layers: [64, 32], epochs: 20, dataStore: store }).sync(
  'mlp-dashboard',
);

b.$click.subscribe(() =>
  classifier.train(
    trainingSet
      .items()
      .map(async (instance) => ({ ...instance, x: await featureExtractor.process(instance.x) })),
  ),
);

const params = modelParameters(classifier);
const prog = trainingProgress(classifier);
const plotTraining = trainingPlot(classifier);

// -----------------------------------------------------------
// BATCH PREDICTION
// -----------------------------------------------------------

const batchMLP = batchPrediction({ name: 'mlp', dataStore: store });
const confMat = confusionMatrix(batchMLP);

const predictButton = button('Update predictions');
predictButton.$click.subscribe(async () => {
  if (!classifier.ready) {
    throwError(new Error('No classifier has been trained'));
  }
  await batchMLP.clear();
  await batchMLP.predict(
    classifier,
    trainingSet
      .items()
      .map(async (instance) => ({ ...instance, x: await featureExtractor.process(instance.x) })),
  );
});

// -----------------------------------------------------------
// REAL-TIME PREDICTION
// -----------------------------------------------------------

const labelP = textInput();
labelP.title = 'Change label';
const captureP = button('Hold to record instances');
captureP.title = 'Capture instances to predict';

// input.$images
//   .filter(() => captureP.$pressed.value)
//   .map((x) => ({ x, y: labelP.$value.value, thumbnail: input.$thumbnails.value }))
//   .subscribe(trainingSet.create.bind(trainingSet));

// const tog = toggle('toggle prediction');
// tog.$checked.subscribe((checked) => {
//   if (checked && !classifier.ready) {
//     throwError(new Error('No classifier has been trained'));
//     setTimeout(() => {
//       tog.$checked.set(false);
//     }, 500);
//   }
// });

const predictionStream = input.$images
  .filter(() => captureP.$pressed.value && classifier.ready)
  .map(async (img) => classifier.predict(await featureExtractor.process(img)))
  .awaitPromises();
  const newInstances = predictionStream
  .map(({label}) => {
    return {x: input.$images.value, y: label, thumbnail: input.$thumbnails.value, keyword: labelP.$value.value}
  })
  const tmpSet=dataset('tmp set', store)
  const tsb = datasetBrowser(tmpSet)
  newInstances.subscribe(trainingSet.create.bind(tmpSet));
const plotResults = confidencePlot(predictionStream);


//classifier.train(trainingSet.items().concat(tmpSet.items()))

const keywordsSet=dataset('keywords set', store)
const kdb = datasetTable(tmpSet, ['y', 'keyword']);

const newKeywords = predictionStream
  .map(({label}) => {
    return {x: label, y: labelP.$value.value,}
  })

  //
  newKeywords.subscribe(trainingSet.create.bind(keywordsSet));
  console.log(newKeywords);

// -----------------------------------------------------------
// DASHBOARDS
// -----------------------------------------------------------

const dash = dashboard({
  title: 'Marcelle Example - Dashboard',
  author: 'Marcelle Pirates Crew',
});

dash
  .page('Data Management')
  .sidebar(input, featureExtractor)
  .use([label, capture], trainingSetBrowser);
dash.page('Training').use(params, b, prog, plotTraining);
dash.page('Batch Prediction').use(predictButton, confMat);
dash.page('Real-time Prediction').sidebar(input).use([labelP, captureP], plotResults, tsb, kdb);
dash.settings.dataStores(store).datasets(trainingSet).models(classifier).predictions(batchMLP);

dash.show();
