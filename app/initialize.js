// config
APP_ROOT = '/';
// Local root for router
APP_ROOT = '/~michal/tadbit/public/';
API_URL = 'http://tadbit.herokuapp.com/cards';
// Local url for api
API_URL = 'http://localhost:8124/cards';

// Setting up Card Model with our RESTful API
var Card = require('models/card');

// Setting up Card View
var CardView = require('views/card');

// Setting up Card Collection with our RESTful API
var CardCollection = require('models/cards');

// Setting up Card Collection View
var CardCollectionView = require('views/cards');

// Setting up the whole app definition
var TadbitApp = new (Backbone.Router.extend({
  routes:  { '': 'index', 'cards/:id': 'show_card'},

  initialize: function() {
    this.cardCollection = new CardCollection();
    this.cardCollectionView = new CardCollectionView({
      collection: this.cardCollection
    });
  },

  start: function() {
    Backbone.history.start({
      pushState: true,
      root: APP_ROOT
    });
  },

  index: function() {
    this.cardCollection.fetch();
  },

  show_card: function(id) {
    // TODO: UGLY, make betters
    var card = this.cardCollection.get(id);
    var cardView = new CardView({ model: card});
    $('#card-collection').html(cardView.render().el);
  }
}));

// Called when page is done loading
$(function() {
  // Starts up our entire app
  TadbitApp.start();

  // Temp solution to add cards via form
  $('#add-submit').click( function() {
    createCard($('#input-question').val(),
               $('#input-answer').val(),
               $('#input-difficulty').val(),
               $('#input-tags').val());
    // Making sure to reset the form when done
    $('#add-reset').click();
  });

  // Logo stuff, TODO move to its own file
  var logoCanvas = $('#logo')[0];
  var context = logoCanvas.getContext('2d');

  // Style for circle and tadpole
  var mainColor = '#bb4444';
  var pairColor = '#fafafa';

  // 3/4ths of a circle, top exposed
  context.strokeStyle = mainColor;
  context.lineWidth = 6;
  context.lineCap = 'round';
  context.beginPath();
  context.arc(20, 20, 15, -0.25 * Math.PI, 1.25 * Math.PI, false);
  context.stroke();
  context.closePath();

  // Tadpole tail
  context.fillStyle = mainColor;
  context.beginPath();
  context.moveTo(16, 15);
  context.quadraticCurveTo(20, -15, 24, 15);
  context.fill();
  context.closePath();

  // Tadpole legs
  context.strokeStyle = mainColor;
  context.lineWidth = 2;
  context.lineCap = 'round';
  context.beginPath();
  context.moveTo(16, 14);
  context.lineTo(15, 8);
  context.moveTo(24, 14);
  context.lineTo(25, 8);
  context.stroke();
  context.closePath();

  // Tadpole head
  context.fillStyle = mainColor;
  context.beginPath();
  context.arc(20, 20, 8, 0, 2 * Math.PI, false);
  context.fill();
  context.closePath();

  // Tadpole eyes
  context.beginPath();
  context.fillStyle = pairColor;
  context.arc(17, 22, 2, 0, 2 * Math.PI, false);
  context.arc(23, 22, 2, 0, 2 * Math.PI, false);
  context.fill();
  context.closePath();

});

// Testing the creation of a single card
function createCard(question, answer, difficulty, tags) {
  var card = new Card();

  card.set({ question: question });
  card.set({ answer: answer });
  card.set({ difficulty: difficulty });
  card.set({ tags: tags });

  card.save();
}

// Testing the destruction of a single card
function destroyCard(card_id) {
  var card = new Card({ id: card_id} );

  card.destroy();
}
