// Network Model Simulation

// Initial University Structure
const university = {
    students: [
        { id: 1, name: "Eve" },
        { id: 2, name: "Frank" }
    ],
    courses: [
        { id: 101, title: "Database Systems" },
        { id: 102, title: "Operating Systems" }
    ],
    enrollments: [
        { studentId: 1, courseId: 101 },
        { studentId: 1, courseId: 102 },
        { studentId: 2, courseId: 101 }
    ]
};

// Function to enroll a student in a course
function enrollStudent(studentId, courseId) {
    // Check if student exists
    const student = university.students.find(s => s.id === studentId);
    if (!student) {
        console.log(`Student with ID ${studentId} not found.`);
        return;
    }

    // Check if course exists
    const course = university.courses.find(c => c.id === courseId);
    if (!course) {
        console.log(`Course with ID ${courseId} not found.`);
        return;
    }

    // Check if already enrolled
    const alreadyEnrolled = university.enrollments.some(
        enrollment => enrollment.studentId === studentId && enrollment.courseId === courseId
    );
    if (alreadyEnrolled) {
        console.log(`${student.name} is already enrolled in ${course.title}.`);
        return;
    }

    university.enrollments.push({ studentId, courseId });
    console.log(`${student.name} enrolled in ${course.title}.`);
}

// Function to get all courses for a student
function getCoursesForStudent(studentId) {
    const student = university.students.find(s => s.id === studentId);
    if (!student) {
        console.log(`Student with ID ${studentId} not found.`);
        return [];
    }

    const courseIds = university.enrollments
        .filter(enrollment => enrollment.studentId === studentId)
        .map(enrollment => enrollment.courseId);

    const courses = university.courses.filter(course => courseIds.includes(course.id));
    return courses;
}

// Function to get all students in a course
function getStudentsInCourse(courseId) {
    const course = university.courses.find(c => c.id === courseId);
    if (!course) {
        console.log(`Course with ID ${courseId} not found.`);
        return [];
    }

    const studentIds = university.enrollments
        .filter(enrollment => enrollment.courseId === courseId)
        .map(enrollment => enrollment.studentId);

    const students = university.students.filter(student => studentIds.includes(student.id));
    return students;
}

// Example Usage
enrollStudent(2, 102); // Frank enrolls in Operating Systems
enrollStudent(1, 101); // Eve already enrolled in Database Systems

console.log("Courses for Eve:", getCoursesForStudent(1));
console.log("Students in Database Systems:", getStudentsInCourse(101));


/*
Frank enrolled in Operating Systems.
Eve is already enrolled in Database Systems.
Courses for Eve: [
  { id: 101, title: 'Database Systems' },
  { id: 102, title: 'Operating Systems' }
]
Students in Database Systems: [
  { id: 1, name: 'Eve' },
  { id: 2, name: 'Frank' }
]
*/