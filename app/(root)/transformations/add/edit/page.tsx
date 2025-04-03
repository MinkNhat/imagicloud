import Header from '@/components/shared/Header'
import TransformationForm from '@/components/shared/TransformationForm';
import { transformationTypes } from '@/constants'
import { getUserById } from '@/lib/actions/user.actions';
import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation';

const EditTransformationPage = async () => {
  const { userId } = await auth();
  const transformation = transformationTypes["edit"];

  if(!userId) redirect('/sign-in')

  const user = await getUserById(userId);

  return (
    <>
      <Header 
        title={transformation.title}
        subtitle={transformation.subTitle}
      />
    
      <section className="mt-10">
        <TransformationForm
          action="Add"
          userId={user._id}
          type="edit"
          creditBalance={user.creditBalance}
        />  
      </section>
    </>
  )
}

export default EditTransformationPage;