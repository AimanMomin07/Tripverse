import React, { useState, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flight, MOCK_FLIGHTS } from '../utils/mockFlights'
import './ChatInterface.css'

type Message = {
  id: string
  type: 'user' | 'bot'
  text: string
  options?: string[]
  suggestedFlight?: Flight
}

type Props = {
  onSuggestFlight: (flight: Flight) => void
}

const questions = [
  {
    id: 'purpose',
    text: "What's the purpose of your trip?",
    options: ['Business', 'Leisure', 'Family Visit']
  },
  {
    id: 'budget',
    text: "What's your preferred budget range?",
    options: ['Economy (₹4000-8000)', 'Premium (₹8000-15000)', 'Business (₹15000+)']
  },
  {
    id: 'preference',
    text: 'Do you have any specific preferences?',
    options: ['Direct Flights', 'Flexible Timing', 'Maximum Comfort']
  }
]

export default function ChatInterface({ onSuggestFlight }: Props) {
  const [messages, setMessages] = useState<Message[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [userPreferences, setUserPreferences] = useState({
    purpose: '',
    budget: '',
    preference: ''
  })

  const chatEndRef = useRef<HTMLDivElement>(null)
  const chatContainerRef = useRef<HTMLDivElement>(null)

  // Scroll chat to bottom
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight
    }
  }

  // Scroll whenever new messages appear
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const createMessage = (message: Omit<Message, 'id'>): Message => ({
    ...message,
    id: Date.now().toString()
  })

  const addMessage = (message: Omit<Message, 'id'>) => {
    setMessages((prev) => [...prev, createMessage(message)])
  }

  // Initial greeting
  useEffect(() => {
    if (messages.length === 0) {
      const initialMessages = [
        createMessage({
          type: 'bot',
          text: "Hello! I'm your AI Travel Assistant. I'll help you find the perfect flight. Let's start with a few questions."
        }),
        createMessage({
          type: 'bot',
          text: questions[0].text,
          options: questions[0].options
        })
      ]
      setMessages(initialMessages)
    }
  }, [])

  const handleOptionClick = async (e: React.MouseEvent, option: string) => {
    e.preventDefault()
    e.stopPropagation()

    addMessage({ type: 'user', text: option })

    const currentQ = questions[currentQuestion]
    const newPreferences = { ...userPreferences, [currentQ.id]: option }
    setUserPreferences(newPreferences)

    // Continue to next question or show recommendation
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
      setTimeout(() => {
        addMessage({
          type: 'bot',
          text: questions[currentQuestion + 1].text,
          options: questions[currentQuestion + 1].options
        })
      }, 500)
    } else {
      // All questions answered
      setTimeout(() => {
        addMessage({
          type: 'bot',
          text: "Perfect! I'll find the best flight based on your preferences..."
        })

        setTimeout(() => {
          const recommendedFlight = suggestFlight(newPreferences)
          const hours = Math.floor(recommendedFlight.durationMin / 60)
          const mins = recommendedFlight.durationMin % 60
          const duration = `${hours}h ${mins}m`

          const messageList = [
            createMessage({
              type: 'bot',
              text: "I've found the perfect flight for you! Here are the details:"
            }),
            createMessage({
              type: 'bot',
              text: `✈️ ${recommendedFlight.airline} Flight ${recommendedFlight.id}
${recommendedFlight.from} → ${recommendedFlight.to}
Duration: ${duration}

Fare Options:
${recommendedFlight.fareClasses
  .map(
    (fc) =>
      `• ${fc.type}: ₹${fc.price.toLocaleString()}
Includes: ${fc.baggage} baggage
${fc.amenities.join(', ')}`
  )
  .join('\n\n')}`,
              suggestedFlight: recommendedFlight
            })
          ]

          setMessages((prev) => [...prev, ...messageList])
          onSuggestFlight(recommendedFlight)
          setTimeout(scrollToBottom, 100)
        }, 1000)
      }, 500)
    }
  }

  const suggestFlight = (prefs: typeof userPreferences): Flight => {
    const scoreFlight = (f: Flight) => {
      let score = 0

      // Purpose scoring
      if (prefs.purpose === 'Business' && f.fareClasses.some((fc) => fc.type === 'Business')) score += 3
      if (prefs.purpose === 'Leisure' && f.fareClasses[0].price < 10000) score += 2
      if (prefs.purpose === 'Family Visit' && f.stops === 0) score += 2

      // Budget scoring
      const lowestPrice = f.fareClasses[0].price
      if (prefs.budget.includes('Economy') && lowestPrice < 8000) score += 3
      if (prefs.budget.includes('Premium') && lowestPrice >= 8000 && lowestPrice < 15000) score += 3
      if (prefs.budget.includes('Business') && lowestPrice >= 15000) score += 3

      // Preference scoring
      if (prefs.preference === 'Direct Flights' && f.stops === 0) score += 3
      if (prefs.preference === 'Flexible Timing') score += 1
      if (prefs.preference === 'Maximum Comfort' && f.rating && f.rating > 4.5) score += 3

      const fareClass = prefs.budget.includes('Economy')
        ? 'Economy'
        : prefs.budget.includes('Premium')
        ? 'Premium'
        : 'Business'

      if (f.fareClasses.some((fc) => fc.type === fareClass)) score += 2

      return score
    }

    const bestFlight = [...MOCK_FLIGHTS].sort((a, b) => scoreFlight(b) - scoreFlight(a))[0]
    return bestFlight
  }

  const preventScroll = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-4 max-w-2xl mx-auto chat-wrapper">
      <div
        ref={chatContainerRef}
        className="chat-container mb-4"
        style={{
          overflowY: 'auto',
          maxHeight: '70vh',
          overscrollBehavior: 'contain'
        }}
        onWheel={(e) => e.stopPropagation()}
        onTouchMove={(e) => e.stopPropagation()}
      >
        <AnimatePresence initial={false}>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mb-4 ${message.type === 'user' ? 'text-right' : ''}`}
            >
              <div
                className={`inline-block rounded-lg px-4 py-2 max-w-[80%] ${
                  message.type === 'user'
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-800'
                }`}
                onMouseDown={preventScroll}
              >
                <p className="whitespace-pre-line">{message.text}</p>

                {message.suggestedFlight && (
                  <button
                    onMouseDown={preventScroll}
                    onClick={(e) => {
                      e.preventDefault()
                      onSuggestFlight(message.suggestedFlight!)
                    }}
                    className="mt-2 btn btn-sm btn-accent"
                  >
                    Book This Flight
                  </button>
                )}
              </div>

              {message.options && (
                <div className="mt-2 flex flex-wrap gap-2 chat-options">
                  {message.options.map((option) => (
                    <button
                      key={option}
                      onClick={(e) => {
                        e.preventDefault()
                        e.stopPropagation()
                        handleOptionClick(e, option)
                      }}
                      className="btn btn-outline btn-sm"
                    >
                      {option}
                    </button>
                  ))}
                </div>
              )}
            </motion.div>
          ))}
        </AnimatePresence>

        <div ref={chatEndRef} />
      </div>
    </div>
  )
}
