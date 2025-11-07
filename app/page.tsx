'use client'

import { useState, useEffect } from 'react'

interface Plant {
  id: string
  name: string
  type: string
  wateringFrequency: number
  lastWatered: string
  sunlight: string
  location: string
}

export default function Home() {
  const [plants, setPlants] = useState<Plant[]>([])
  const [formData, setFormData] = useState({
    name: '',
    type: '',
    wateringFrequency: '7',
    sunlight: 'medium',
    location: ''
  })

  useEffect(() => {
    const savedPlants = localStorage.getItem('plants')
    if (savedPlants) {
      setPlants(JSON.parse(savedPlants))
    }
  }, [])

  useEffect(() => {
    localStorage.setItem('plants', JSON.stringify(plants))
  }, [plants])

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const newPlant: Plant = {
      id: Date.now().toString(),
      name: formData.name,
      type: formData.type,
      wateringFrequency: parseInt(formData.wateringFrequency),
      lastWatered: new Date().toISOString(),
      sunlight: formData.sunlight,
      location: formData.location
    }

    setPlants([...plants, newPlant])
    setFormData({
      name: '',
      type: '',
      wateringFrequency: '7',
      sunlight: 'medium',
      location: ''
    })
  }

  const handleWater = (id: string) => {
    setPlants(plants.map(plant =>
      plant.id === id
        ? { ...plant, lastWatered: new Date().toISOString() }
        : plant
    ))
  }

  const handleDelete = (id: string) => {
    setPlants(plants.filter(plant => plant.id !== id))
  }

  const getNextWateringDate = (lastWatered: string, frequency: number) => {
    const date = new Date(lastWatered)
    date.setDate(date.getDate() + frequency)
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  const getDaysUntilWatering = (lastWatered: string, frequency: number) => {
    const nextDate = new Date(lastWatered)
    nextDate.setDate(nextDate.getDate() + frequency)
    const today = new Date()
    const diffTime = nextDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getPlantEmoji = (type: string) => {
    const emojis: { [key: string]: string } = {
      'succulent': '🌵',
      'flowering': '🌺',
      'foliage': '🌿',
      'herb': '🌱',
      'tree': '🌳',
      'vine': '🍃'
    }
    return emojis[type.toLowerCase()] || '🪴'
  }

  return (
    <div className="container">
      <header>
        <h1>🪴 Plant Care Tracker</h1>
        <p>Keep your green friends healthy and thriving</p>
      </header>

      <div className="add-plant-section">
        <h2>Add New Plant</h2>
        <form onSubmit={handleSubmit}>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="name">Plant Name</label>
              <input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., My Monstera"
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="type">Plant Type</label>
              <select
                id="type"
                value={formData.type}
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                required
              >
                <option value="">Select type</option>
                <option value="succulent">Succulent</option>
                <option value="flowering">Flowering</option>
                <option value="foliage">Foliage</option>
                <option value="herb">Herb</option>
                <option value="tree">Tree</option>
                <option value="vine">Vine</option>
              </select>
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="wateringFrequency">Watering Frequency (days)</label>
              <input
                id="wateringFrequency"
                type="number"
                min="1"
                max="365"
                value={formData.wateringFrequency}
                onChange={(e) => setFormData({ ...formData, wateringFrequency: e.target.value })}
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="sunlight">Sunlight Needs</label>
              <select
                id="sunlight"
                value={formData.sunlight}
                onChange={(e) => setFormData({ ...formData, sunlight: e.target.value })}
                required
              >
                <option value="low">Low (Indirect)</option>
                <option value="medium">Medium (Partial sun)</option>
                <option value="high">High (Full sun)</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="location">Location</label>
            <input
              id="location"
              type="text"
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              placeholder="e.g., Living room window"
              required
            />
          </div>

          <button type="submit">Add Plant</button>
        </form>
      </div>

      {plants.length === 0 ? (
        <div className="empty-state">
          <div className="empty-state-icon">🌱</div>
          <h3>No plants yet!</h3>
          <p>Add your first plant to start tracking its care schedule</p>
        </div>
      ) : (
        <div className="plants-grid">
          {plants.map((plant) => {
            const daysUntil = getDaysUntilWatering(plant.lastWatered, plant.wateringFrequency)
            const isOverdue = daysUntil < 0

            return (
              <div key={plant.id} className="plant-card">
                <div className="plant-icon">{getPlantEmoji(plant.type)}</div>
                <h3>{plant.name}</h3>
                <div className="plant-type">{plant.type}</div>

                <div className="care-info">
                  <div className="info-row">
                    <span className="info-label">Location:</span>
                    <span className="info-value">{plant.location}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Sunlight:</span>
                    <span className="info-value">{plant.sunlight}</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Water Every:</span>
                    <span className="info-value">{plant.wateringFrequency} days</span>
                  </div>
                  <div className="info-row">
                    <span className="info-label">Last Watered:</span>
                    <span className="info-value">
                      {new Date(plant.lastWatered).toLocaleDateString('en-US', {
                        month: 'short',
                        day: 'numeric'
                      })}
                    </span>
                  </div>
                </div>

                <div className="next-water" style={{
                  background: isOverdue
                    ? 'linear-gradient(135deg, #f44336 0%, #e91e63 100%)'
                    : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                }}>
                  <strong>{isOverdue ? '⚠️ OVERDUE' : 'Next Watering'}</strong>
                  <div className="next-water-date">
                    {isOverdue
                      ? `${Math.abs(daysUntil)} days ago`
                      : daysUntil === 0
                        ? 'Today'
                        : `in ${daysUntil} days`}
                  </div>
                  <div style={{ fontSize: '0.9rem', marginTop: '0.3rem' }}>
                    {getNextWateringDate(plant.lastWatered, plant.wateringFrequency)}
                  </div>
                </div>

                <div className="action-buttons">
                  <button className="btn-water" onClick={() => handleWater(plant.id)}>
                    💧 Water Now
                  </button>
                  <button className="btn-delete" onClick={() => handleDelete(plant.id)}>
                    🗑️ Remove
                  </button>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
