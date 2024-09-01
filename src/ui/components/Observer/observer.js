"use client"
//Imports
import React, { useRef, useEffect } from "react"

export const Observer = ({ threshold = [0, 0.5, 1], children }) => {
  const observer = useRef(null)
  const elementsRef = useRef([])

  useEffect(() => {
    const callback = (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("init-hidden-off")
          entry.target.classList.remove("init-hidden")
        } else {
          entry.target.classList.remove("init-hidden-off")
          entry.target.classList.add("init-hidden")
        }
      })
    }

    observer.current = new IntersectionObserver(callback, { threshold })

    elementsRef.current.forEach((element) => {
      observer.current.observe(element)
    })

    return () => {
      if (observer.current) {
        observer.current.disconnect()
      }
    }
  }, [threshold])

  return (
    <>
      {React.Children.map(children, (child, index) => {
        return React.cloneElement(child, {
          ref: (el) => {
            if (el) {
              el.classList.add("init-hidden")
              elementsRef.current[index] = el
            }
          },
        })
      })}
    </>
  )
}
