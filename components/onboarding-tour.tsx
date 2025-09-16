"use client"

import { useEffect, useState } from "react"
import Joyride, { type CallBackProps, STATUS, type Step } from "react-joyride"

interface OnboardingTourProps {
  onComplete: () => void
}

export function OnboardingTour({ onComplete }: OnboardingTourProps) {
  const [run, setRun] = useState(false)

  const steps: Step[] = [
    {
      target: '[data-tour="home-tab"]',
      content: "Explore Vyaas features here",
      placement: "top",
    },
    {
      target: '[data-tour="soil-health-tab"]',
      content: "Check your soil health",
      placement: "top",
    },
    {
      target: '[data-tour="crop-recommendation-tab"]',
      content: "Get best crops for your land",
      placement: "top",
    },
    {
      target: '[data-tour="market-insights-tab"]',
      content: "See future market prices",
      placement: "top",
    },
  ]

  useEffect(() => {
    // Start the tour after a short delay to ensure DOM is ready
    const timer = setTimeout(() => {
      setRun(true)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const handleJoyrideCallback = (data: CallBackProps) => {
    const { status } = data

    if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      setRun(false)
      // Show final completion message
      setTimeout(() => {
        alert("You're ready to explore Vyaas!")
        onComplete()
      }, 300)
    }
  }

  return (
    <Joyride
      steps={steps}
      run={run}
      continuous={true}
      showSkipButton={true}
      callback={handleJoyrideCallback}
      styles={{
        options: {
          primaryColor: "#0891b2",
          backgroundColor: "#ffffff",
          textColor: "#4b5563",
          overlayColor: "rgba(0, 0, 0, 0.4)",
          arrowColor: "#ffffff",
          zIndex: 1000,
        },
        tooltip: {
          borderRadius: "8px",
          fontSize: "14px",
        },
        tooltipContainer: {
          textAlign: "left",
        },
        buttonNext: {
          backgroundColor: "#0891b2",
          color: "#ffffff",
          borderRadius: "6px",
          fontSize: "14px",
          padding: "8px 16px",
        },
        buttonBack: {
          color: "#6b7280",
          fontSize: "14px",
        },
        buttonSkip: {
          color: "#6b7280",
          fontSize: "14px",
        },
      }}
      locale={{
        back: "Back",
        close: "Close",
        last: "Finish",
        next: "Next",
        skip: "Skip tour",
      }}
    />
  )
}
