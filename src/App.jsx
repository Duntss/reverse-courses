import { useState, useEffect } from 'react'
import Sidebar from './components/Sidebar'
import CourseContent from './components/CourseContent'
import Welcome from './components/Welcome'
import courses from './data/courses'
import './App.css'

const STORAGE_KEY = 're-academy-progress'

function loadProgress() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (saved) return JSON.parse(saved)
  } catch {}
  return { completedExercises: [], hintsUsed: {} }
}

export default function App() {
  const [selectedId, setSelectedId] = useState(null)
  const [progress, setProgress] = useState(loadProgress)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(progress))
  }, [progress])

  // A course is accessible if its release date has passed AND the previous exercise is done
  function getCourseStatus(course) {
    const now = new Date()
    const released = now >= new Date(course.releaseDate)
    const prevDone = course.id === 1 || progress.completedExercises.includes(course.id - 1)

    if (!released) return 'time-locked'
    if (!prevDone) return 'exercise-locked'
    if (progress.completedExercises.includes(course.id)) return 'completed'
    return 'available'
  }

  function completeExercise(courseId) {
    setProgress(prev => ({
      ...prev,
      completedExercises: [...new Set([...prev.completedExercises, courseId])],
    }))
  }

  function useHint(courseId, hintIndex) {
    setProgress(prev => ({
      ...prev,
      hintsUsed: {
        ...prev.hintsUsed,
        [courseId]: Math.max(hintIndex + 1, prev.hintsUsed[courseId] || 0),
      },
    }))
  }

  const selectedCourse = courses.find(c => c.id === selectedId)
  const completedCount = progress.completedExercises.length
  const releasedCount = courses.filter(c => new Date() >= new Date(c.releaseDate)).length

  return (
    <div className={`app ${sidebarOpen ? 'sidebar-open' : ''}`}>
      <Sidebar
        courses={courses}
        selectedId={selectedId}
        onSelect={setSelectedId}
        getCourseStatus={getCourseStatus}
        completedCount={completedCount}
        releasedCount={releasedCount}
        isOpen={sidebarOpen}
      />

      <button
        className="sidebar-toggle"
        onClick={() => setSidebarOpen(v => !v)}
        title={sidebarOpen ? 'Réduire le menu' : 'Ouvrir le menu'}
      >
        {sidebarOpen ? '←' : '☰'}
      </button>

      <main className="main-content">
        {selectedCourse ? (
          <CourseContent
            course={selectedCourse}
            status={getCourseStatus(selectedCourse)}
            hintsUsed={progress.hintsUsed[selectedCourse.id] || 0}
            isCompleted={progress.completedExercises.includes(selectedCourse.id)}
            onComplete={completeExercise}
            onUseHint={useHint}
            onNavigate={setSelectedId}
            courses={courses}
            getCourseStatus={getCourseStatus}
          />
        ) : (
          <Welcome
            courses={courses}
            getCourseStatus={getCourseStatus}
            completedCount={completedCount}
            releasedCount={releasedCount}
            onSelect={setSelectedId}
          />
        )}
      </main>
    </div>
  )
}
