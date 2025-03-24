import Header from '@/components/shared/Header'
import { transformationTypes } from '@/constants'
import React from 'react'

const AddTransformationTypePage = async ({ params }: SearchParamProps) => {
  const { type } = await params;
  const transformation = transformationTypes[type];

  return (
    <>
      <Header 
        title={transformation.title}
        subtitle={transformation.subTitle}
      />
    </>
  )
}

export default AddTransformationTypePage