import type { Metadata } from 'next';
import { AUTHOR_NAME } from '@/lib/constants';

export const metadata: Metadata = {
  title: 'About',
  description: `Learn more about ${AUTHOR_NAME}`,
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      <div className="text-center mb-10">
        {/* Profile image placeholder */}
        <div className="w-36 h-36 mx-auto mb-6 bg-pink-light overflow-hidden rounded-full border-2 border-pink-primary">
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-4xl">&#10047;</span>
          </div>
        </div>

        <h1
          className="text-3xl font-bold gradient-pink-text mb-2"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          About {AUTHOR_NAME}
        </h1>
        <p className="text-[11px] tracking-[0.15em] uppercase text-text-light">
          Blogger &middot; Student &middot; Fitness Enthusiast
        </p>
      </div>

      <hr className="section-divider" />

      <div className="space-y-5 text-text-light leading-relaxed" style={{ fontFamily: 'var(--font-serif)' }}>
        <p>
          Welcome to my little corner of the internet! This blog is where I share my thoughts,
          experiences, and adventures as I navigate through life. From school stress to gym wins,
          from relationship advice to lifestyle tips — I write about it all.
        </p>
        <p>
          I started this blog as a creative outlet and a way to connect with others who might be
          going through similar things. Whether you&apos;re here for study motivation, workout inspo,
          or just some real talk about life — you&apos;re in the right place.
        </p>
        <p>
          When I&apos;m not writing, you can find me at the gym, studying at a cute caf\u00e9, or planning
          my next self-care day. I believe in being authentic, working hard, and always choosing
          growth.
        </p>
        <p className="font-medium text-text">
          Thanks for being here. I hope my words bring you comfort, motivation, or at least a smile.
        </p>
      </div>
    </div>
  );
}
