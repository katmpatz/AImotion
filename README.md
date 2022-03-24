How can machine learning technologies, like facial emotional recognition, be used by psychologists to support their work during a session with a patient?


## aiMotions
A facial emotion recognition machine learning tool that aids psychologists in the treatment of their patients.

### Description
This tool is designed to enable psychologists to leverage machine learning technologies (in this case emotional recognition) and incorporate them into their daily work.




### Design

### Implementation

For the implementation of the tool we used [Marcelle](https://https://marcelle.dev/).

The first step for the implementation of our solution was to find a dataset with images of facial expressions, in order to train our model to recognize different emotions. We found one widely used dataset for emotion recognition in Kaggle, which has thousands of photos for 7 different emotional states: happy, sad, angry, neutral, surprise, disgust, and fear. However, it has to be mentioned that some of the images are included in more than one category of emotions. As a consequence, there was a noticeable confusion between categories, like neutral and sad or surprise and fear. We aim to address this limitation in future research.

Our application consists of five pages. The “Data Management”, where a user can label and upload photos of the different emotions. The “Training”, where the user chooses the parameters of the training, trains the model, and sees some statistics about it. It should be noted that we tried to train the model with more pictures, but the training was really slow. So in the context of this prototype, we trained our model with a small sample of photos per emotion. The “Batch Prediction”, where there is a confusion matrix between the different emotions. The “Real-time predictions”, which includes a live webcam video and is considered the main component of our application. On this page, the psychologist can add keywords, based on the theme that they are talking with their patient, capture one image of the live video, see the prediction of the emotion based on the image, and relabel it if they think that it is incorrect. Every time that psychologists capture an image this is saved in a new dataset along with its keyword and emotion. The last page is the “Analytics”, where the user can see a heatmap based on the association of keywords and emotions. For this page, we created a custom component and we used p5.js to create the chart.
