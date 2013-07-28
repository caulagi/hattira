
/**
 * Module dependencies.
 */

var mongoose = require('mongoose')
  , env = process.env.NODE_ENV || 'development'
  , config = require('../../config/config')[env]
  , Schema = mongoose.Schema

/**
 * Getters
 */

var getTags = function (tags) {
  return tags.join(',')
}

/**
 * Setters
 */

var setTags = function (tags) {
  return tags.split(',')
}

/**
 * Meetup Schema
 */

var MeetupSchema = new Schema({
  title: {type : String, default : '', trim : true},
  description: {type : String, default : '', trim : true},
  meetupDate: {type : Date, default : '', trim : true},
  venue: {type : String, default : '', trim : true},
  latitude: {type : Number, default : '', trim : true},
  longitude: {type : Number, default : '', trim : true},
  user: {type : Schema.ObjectId, ref : 'User'},
  comments: [{
    body: { type : String, default : '' },
    user: { type : Schema.ObjectId, ref : 'User' },
    createdAt: { type : Date, default : Date.now }
  }],
  attending: [{
    user: { type : Schema.ObjectId, ref : 'User' },
  }],
  tags: {type: [], get: getTags, set: setTags},
  createdAt  : {type : Date, default : Date.now}
})

/**
 * Validations
 */

MeetupSchema.path('title').validate(function (title) {
  return title.length > 0
}, 'Meetup title cannot be blank')

MeetupSchema.path('description').validate(function (description) {
  return description && description.length > 0
}, 'Meetup description cannot be blank')

MeetupSchema.path('venue').validate(function (venue) {
  return venue && venue.length > 0
}, 'Meetup venue is required')

MeetupSchema.path('latitude').validate(function (latitude) {
  return latitude && typeof latitude === 'number'
}, 'Meetup latitude is required')

MeetupSchema.path('longitude').validate(function (longitude) {
  return longitude && typeof longitude === 'number'
}, 'Meetup longitude is required')

/**
 * Methods
 */

MeetupSchema.methods = {

  /**
   * Add comment
   *
   * @param {User} user
   * @param {Object} comment
   * @param {Function} cb
   * @api private
   */

  addComment: function (user, comment, cb) {
    //var notify = require('../mailer/notify')

    this.comments.push({
      body: comment.body,
      user: user._id
    })

    /*
    notify.comment({
      meetup: this,
      currentUser: user,
      comment: comment.body
    })
    */

    this.save(cb)
  }

}

/**
 * Statics
 */

MeetupSchema.statics = {

  /**
   * Find meetup by id
   *
   * @param {ObjectId} id
   * @param {Function} cb
   * @api private
   */

  load: function (id, cb) {
    this.findOne({ _id : id })
      .populate('user', 'name email username')
      .populate('comments.user')
      .exec(cb)
  },

  /**
   * List meetups
   *
   * @param {Object} options
   * @param {Function} cb
   * @api private
   */

  list: function (options, cb) {
    var criteria = options.criteria || {}

    this.find(criteria)
      .populate('user', 'name username')
      .sort({'createdAt': -1}) // sort by date
      .limit(options.perPage)
      .skip(options.perPage * options.page)
      .exec(cb)
  }

}

mongoose.model('Meetup', MeetupSchema)