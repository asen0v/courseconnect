// Function to handle saving a course to favorites
const handleSave = async (id) => {
  await fetch('/api/favourites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ id: id })
  });
};

// Function to handle removing a course from favorites
const handleRemove = async (id) => {
  console.log('Handle Remove:', id); // Check if the function is being called
  await fetch('/api/favourites', {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: id })
  });
};

// Function to generate the HTML for displaying a course
const courseView = (course) => `
<br/>
<div class="col-12">
    <div class="card">
        <h5 class="card-header"> <img src="./images/online-course.png" width="28px" height="28px"> ${course.course_title} <strong> | <img src="./images/search.png" width="28px" height="28px"> Match: ${course.score}</strong>
       |  <a href="#" class="btn btn-warning" onclick="handleSave('${course._id}')">Add To Favourites</a>
        </h5>
        <div class="card-body">
          <ul class="list-group">
               <li class="list-group-item"><img src="./images/pound-sterling.png" width="20px" height="20px"> Price: £${course.price}</li>
                <li class="list-group-item"><img src="./images/subscribers.png" width="20px" height="20px"> Subscribers: ${course.num_subscribers} | <img src="./images/reviews.png" width="20px" height="20px"> Reviews: ${course.num_reviews}</li>
                <li class="list-group-item"><img src="./images/lectures.png" width="20px" height="20px"> Lectures: ${course.num_lectures}</li>
                <li class="list-group-item"><img src="./images/level.png" width="20px" height="20px"> Level: ${course.level}</li>
                <li class="list-group-item"><img src="./images/duration.png" width="20px" height="20px"> Duration: ${course.content_duration} hours</li>
                <li class="list-group-item"><img src="./images/published.png" width="20px" height="20px"> Published: ${course.published_timestamp}</li>
                <li class="list-group-item"><img src="./images/subject.png" width="20px" height="20px"> Subject: ${course.subject}</li>
         <li class="list-group-item"><center><a href="${course.url}" target="_blank" class="btn btn-primary">View Course <img src="./images/chevron.png" height="16px" width="16px"></a></center></li>
                </ul>
        </div>
      </div>
 </div>
`;

// Function to handle the form submission
const handleSubmit = async () => {
    const searchVal = document.querySelector("#searchInput").value;
    try {
        const courseDomRef = document.querySelector('#courseItems');
        const ref = await fetch(`/api/search-courses/?search=${searchVal}`);
        const searchResults = await ref.json();
        let courseHtml = [];
        searchResults.forEach(course => {
           courseHtml.push(courseView(course));
        });
        courseDomRef.innerHTML = courseHtml.join(""); 
    } catch (e) {
        console.log(e);
        console.log('Could not search the api');
    }
};
