import type { Metadata } from 'next';

import ScenePageContent from '@/components/ScenePageContent';
import { buildSceneJsonLd, generateSceneMetadata } from '@/lib/scene-page';

const ROUTE_PATH = '/letreiro-de-aniversario';
const METADATA_NAMESPACE = 'Metadata.letreiroDeAniversario';
const SCOPE = 'Aniversario';

export async function generateMetadata({
  params: { locale },
}: {
  params: { locale: string };
}): Promise<Metadata> {
  return generateSceneMetadata({ locale, routePath: ROUTE_PATH, metadataNamespace: METADATA_NAMESPACE });
}

export default async function AniversarioPage({ params: { locale } }: { params: { locale: string } }) {
  const jsonLd = await buildSceneJsonLd({ locale, routePath: ROUTE_PATH, metadataNamespace: METADATA_NAMESPACE });

  return (
    <>
      <script
        type='application/ld+json'
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <ScenePageContent scope={SCOPE} />
    </>
  );
}
