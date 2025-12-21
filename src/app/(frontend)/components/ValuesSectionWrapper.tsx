'use client'

import React from 'react'
import dynamic from 'next/dynamic'

// Dynamically import ValuesSection with SSR disabled to avoid hydration issues
const ValuesSectionDynamic = dynamic(() => import('./ValuesSection'), {
  ssr: false,
  loading: () => <div className="h-[400px] w-full" />
})

interface Value {
  icon?: {
    url: string
    mimeType?: string
  }
  title?: string
  description?: string
}

interface ValuesSectionWrapperProps {
  values: Value[]
}

const ValuesSectionWrapper: React.FC<ValuesSectionWrapperProps> = ({ values }) => {
  return <ValuesSectionDynamic values={values} />
}

export default ValuesSectionWrapper
