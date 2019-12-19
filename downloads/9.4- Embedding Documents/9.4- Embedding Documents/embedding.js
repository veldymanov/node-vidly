const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/playground')
  .then(() => console.log('Connected to MongoDB...'))
  .catch(err => console.error('Could not connect to MongoDB...', err));

const authorSchema = new mongoose.Schema({
  name: String,
  bio: String,
  website: String
});

const Author = mongoose.model('Author', authorSchema);

const Course = mongoose.model('Course', new mongoose.Schema({
  name: String,
  authors: [authorSchema],
}));

async function createCourse(name, authors) {
  const course = new Course({
    name,
    authors
  });

  const result = await course.save();
  console.log(result);
}

async function listCourses() {
  const courses = await Course.find();
  console.log(courses);
}

async function updateAuthor(courseId) {
  // Query first
  // const course = await Course.findById(courseId);
  // course.author.name = 'Andrii';
  // course.save();

  // Update first
  await Course.update({ _id: courseId }, {
    $set: {
      'author.name': 'John Smith'
    }
  });
}

async function addAuthor(courseId, author) {
  // Query first
  const course = await Course.findById(courseId);
  course.authors.push(author);
  course.save();
}

async function removeAuthor(courseId, authorId) {
  // Query first
  const course = await Course.findById(courseId);
  const author = course.authors.id(authorId);
  author.remove();
  course.save();
}

// createCourse('Node Course', [
//   new Author({ name: 'Mosh' }),
//   new Author({ name: 'Andrew' })
// ]);
// removeAuthor('5dfb3d917ec34a3658b50459', '5dfb3d917ec34a3658b50457');
// addAuthor('5dfb3d917ec34a3658b50459', new Author({ name: 'John' }));
// updateAuthor('5dfa524aef1a6b40c8e1c956');
listCourses();
