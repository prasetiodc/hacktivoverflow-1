const Model = require('../models/answer')
const Question = require('../models/question')

class Answer {
  static findAll(req, res) {
    Model.find()
      .populate('userId')
      .then(data => {
        res.status(200).json(data)
      })
      .catch(err => {
        res.status(500).json(err)
      })
  }

  static create(req, res) {
    let newAnswer = new Model({
      description: req.body.description,
      upvotes: [],
      downvotes: [],
      userId: req.userId,
    })
    Model.create(newAnswer)
      .then(data => {
        return Question.findByIdAndUpdate(req.body.questionId, { $push: { answers: data._id } }, { useFindAndModify: true, new: true })
      })
      .then(data => {
        res.status(201).json(data)
      })
      .catch(err => {
        res.status(500).json(err)
      })
  }

  static findOne(req, res) {
    Model.findById(req.params.id)
      .populate('userId')
      .then(data => {
        res.status(200).json(data)
      })
      .catch(err => {
        res.status(500).json(err)
      })
  }

  static update(req, res) {
    let newData = {
      description: req.body.description,
    }
    Model.findByIdAndUpdate(req.params.id, { $set: newData }, {  useFindAndModify: true, new: true  })
      .then(data => {
        res.status(200).json(data)
      })
      .catch(err => {
        res.status(500).json(err)
      })
  }

  static upvote(req, res) {
    Model.findOne({
      $and: [
        { upvotes: req.userId },
        { _id: req.params.id }
      ]
    })
      .then(data => {
        if (!data) {
          Model.findByIdAndUpdate(req.params.id, { $push: { upvotes: req.userId }, $pull: { downvotes: req.userId } }, {  useFindAndModify: true, new: true  })
            .then(data => {
              res.status(200).json(data)
            })
        } else {
          Model.findByIdAndUpdate(req.params.id, { $pull: { upvotes: req.userId } }, {  useFindAndModify: true, new: true  })
            .then(data => {
              res.status(200).json(data)
            })
        }
      })
      .catch(err => {
        res.status(500).json(err)
      })
  }

  static downvote(req, res) {
    Model.findOne({
      $and: [
        { downvotes: req.userId },
        { _id: req.params.id }
      ]
    })
      .then(data => {
        if (!data) {
          Model.findByIdAndUpdate(req.params.id, { $pull: { upvotes: req.userId }, $push: { downvotes: req.userId } }, {  useFindAndModify: true, new: true  })
            .then(data => {
              res.status(200).json(data)
            })
        } else {
          Model.findByIdAndUpdate(req.params.id, { $pull: { downvotes: req.userId } }, {  useFindAndModify: true, new: true  })
            .then(data => {
              res.status(200).json(data)
            })
        }
      })
      .catch(err => {
        res.status(500).json(err)
      })
  }
}

module.exports = Answer