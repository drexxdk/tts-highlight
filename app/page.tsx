'use client';

import SpecialCharacters from '@/features/tts/components/SpecialCharacters';
import Image from 'next/image';

const StackedCard = () => {
  return (
    <div className="overflow-hidden rounded bg-white shadow-lg">
      <Image src={'/img/card.jpg'} alt="The Coldest Sunset" width={800} height={487} />
      <div className="px-6 py-4">
        <div className="mb-2 text-xl font-bold text-gray-950">The Coldest Sunset</div>
        <p className="text-base text-gray-700">
          Lorem what ipsum dolor sit amet, consectetur adipisicing elit. Voluptatibus quia, nulla! Maiores et
          perferendis eaque, exercitationem praesentium nihil.
        </p>
      </div>
      <div className="px-6 pb-2 pt-4">
        <span className="mb-2 mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700">
          #photography
        </span>
        <span className="mb-2 mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700">
          #travel
        </span>
        <span className="mb-2 mr-2 inline-block rounded-full bg-gray-200 px-3 py-1 text-sm font-semibold text-gray-700">
          #winter
        </span>
      </div>
    </div>
  );
};

const Page = () => {
  return (
    <article className="grid gap-8">
      <section>
        <h2 className="mb-2 text-xl font-bold">Features</h2>
        <ul className="list-inside list-disc">
          <li>Selected text player</li>
          <li>Previous/Next word button functionality</li>
          <li>Previous/Next sentence button functionality</li>
          <li>Selection that stays until the player closes (Except for Firefox)</li>
          <li>Supports selection across different react components</li>
          <li>Active word highlight (Except for Firefox)</li>
          <li>Polly integration</li>
          <li>No rerender of react components for TTS or Highlight</li>
          <li>Reads and highlights correctly on all tested markup structures</li>
          <li>Works on all browsers and devices</li>
          <li>Change playback rate</li>
          <li>
            Automatic punctuations on sentence endings for text given to polly, to get correct sentence seperations.
          </li>
          <li>Change language</li>
          <li>Ignore elements that has specific data-attribute</li>
        </ul>
      </section>
      <section>
        <h2 className="mb-2 text-xl font-bold">ToDo</h2>
        <ul className="list-inside list-disc">
          <li>
            Support all languages specified here{' '}
            <a
              href="https://bitbucket.org/alineadigital/next-api/src/master/Alinea.Api.Next/Controllers/PollyController.cs"
              className="text-orange-300 underline hover:no-underline"
            >
              https://bitbucket.org/alineadigital/next-api/src/master/Alinea.Api.Next/Controllers/PollyController.cs
            </a>
          </li>
          <li>Support for alternative being used for TTS on element instead of what is visually shown</li>
          <li>Switch polly audio files when needed (it only uses first file currently)</li>
          <li>Full page player</li>
          <li>Duration slider</li>
        </ul>
      </section>
      <section>
        <h2 className="mb-2 text-xl font-bold">Wish list</h2>
        <ul className="list-inside list-disc">
          <li>
            Firefox Highlight API support{' '}
            <a
              href="https://bugzilla.mozilla.org/show_bug.cgi?id=1703961"
              className="text-orange-300 underline hover:no-underline"
            >
              https://bugzilla.mozilla.org/show_bug.cgi?id=1703961
            </a>
          </li>
          <li>Auto detect text language</li>
          <li>Support multiple spoken languages at the same time</li>
          <li>Audio streaming instead of mp3</li>
          <li>Some way of giving ::highlight higher z-index than ::selection</li>
          <li>More options for ::highlight styling</li>
        </ul>
      </section>
      <section>
        <h2 className="mb-2 text-xl font-bold">Test content</h2>
        <div className="grid gap-2">
          <p>Ignore<span className='bg-red-500' data-tts-ignore>THIS SHOULD BE IGNORED</span>part</p>
          <p>Ignore <span className='bg-red-500' data-tts-ignore>THIS SHOULD BE IGNORED</span> part</p>
          <div className="grid gap-4 sm:grid-cols-2">
            <StackedCard />
            <StackedCard />
          </div>
          <p>This is a long paragraph with many different words.</p>
          <ol className="list-inside list-decimal">
            <li>
              This is a <b>list</b> &nbsp;&nbsp;&nbsp;item.
            </li>
            <li>
              One{' '}
              <u>
                Two <b>Three Four</b>Five Six Seven <b>Eight</b>9 10...
              </u>
              !&quot;,.?&apos;
            </li>
            <li>Random symbol test ??!&quot;#¤&quot;&quot;!%&/()=?&quot;</li>
          </ol>
          <p>This is amazing!</p>
          <p>1234567890+´¨ø-.,&lt;!&quot;#¤%&/()=?`^_:;&gt;`&quot;&apos;*æøåÆØÅ</p>
          <p>
            1 2 3 4 5 6 7 8 9 0 + ´ ¨ ø - . , &lt; ! &quot; # ¤ % & / ( ) = ? ` ^ _ : ; &gt; ` &quot; &apos; * æ ø å Æ Ø
            Å |
          </p>
          <p>
            a1 a2 a3 a4 a5 a6 a7 a8 a9 a0 a+ a´ a¨ aø a- a. a, a&lt; a! a&quot; a# a¤ a% a& a/ a( a) a= a? a` a^ a_ a:
            a; a&gt; a` a&quot; a&apos; a* aæ aø aå aÆ aØ Åa a|
          </p>
          <p>
            1a 2a 3a 4a 5a 6a 7a 8a 9a 0a +a ´a ¨a øa -a .a ,a &lt;a !a &quot;a #a ¤a %a &a /a (a )a =a ?a `a ^a _a :a
            ;a &gt;a `a &quot;a &apos;a *a æa øa åa Æa Øa Åa |a
          </p>
          <p>
            a1a a2a a3a a4a a5a a6a a7a a8a a9a a0a a+a a´a a¨a aøa a-a a.a a,a a&lt;a a!a a&quot;a a#a a¤a a%a a&a a/a
            a(a a)a a=a a?a a`a a^a a_a a:a a;a a&gt;a a`a a&quot;a a&apos;a a*a aæa aøa aåa aÆa aØa aÅa a|a
          </p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed rutrum eros velit, in iaculis mi tempor sed. Ut
            odio odio, aliquet eu elit ac, ornare efficitur risus. Sed massa est, consectetur non ipsum eu, vehicula
            suscipit mi. Vestibulum sollicitudin sagittis neque, vitae aliquet neque vulputate in. Nunc sem odio,
            porttitor nec felis ac, fermentum scelerisque ante. Suspendisse viverra sodales convallis. Sed non velit
            vitae nibh consectetur efficitur. Pellentesque consectetur in leo quis interdum. Sed diam ligula, vestibulum
            sit amet interdum non, tincidunt in metus. Aliquam porta molestie erat at molestie. Pellentesque lobortis
            hendrerit lorem tempus ultricies. Curabitur ut magna vel libero tincidunt sollicitudin.
          </p>
          <p>
            Mauris hendrerit turpis sit amet elementum rhoncus. Curabitur et turpis sed velit efficitur lobortis
            elementum non turpis. Nulla dignissim in urna sed vulputate. Integer consectetur metus non ligula vehicula
            consequat. Orci varius natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus.
            Pellentesque aliquam sed orci vel fermentum. Mauris gravida venenatis erat, sit amet volutpat tortor
            tincidunt a. Morbi efficitur condimentum turpis, at tristique orci. Sed placerat ac risus vitae tempor.
            Aliquam consectetur nisi sit amet mollis varius.
          </p>
          <p>
            Morbi sagittis risus tincidunt ipsum fringilla, ac tempor sapien condimentum. Suspendisse condimentum
            volutpat euismod. Ut neque augue, condimentum sed euismod eu, eleifend malesuada purus. In pretium nunc
            magna, id commodo urna mattis at. Sed bibendum, dolor vel commodo placerat, justo justo dictum est, non
            auctor erat nibh ac erat. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac
            turpis egestas. Cras lacinia arcu in ex commodo fermentum.
          </p>
          <p>
            Aliquam vitae quam tempus, pharetra massa at, commodo leo. Donec vulputate sapien a risus commodo, eget
            blandit arcu semper. In tincidunt in nunc imperdiet lacinia. Vestibulum ac velit volutpat, facilisis nibh
            et, varius erat. Integer dapibus leo eget nisi efficitur, eu ornare dui sagittis. Nam a ullamcorper justo,
            ac efficitur elit. Vestibulum ornare, dui nec convallis tincidunt, nulla urna laoreet massa, non rutrum
            magna ligula quis felis. Cras pretium nibh sem, non rhoncus risus volutpat in. Suspendisse fermentum
            dignissim est. Cras accumsan sem quis ipsum vehicula viverra.
          </p>
          <p>
            Aliquam congue nec justo eu consequat. Vestibulum vel enim nec massa scelerisque fringilla. Nulla gravida
            eleifend ligula, vitae placerat nunc suscipit id. Donec ut mollis lectus. Curabitur et lorem nisl. Integer
            vel mi a magna finibus tincidunt. Mauris scelerisque ligula nec ipsum laoreet laoreet. Aliquam erat
            volutpat. Vestibulum at urna dolor.
          </p>
        </div>
      </section>
      <SpecialCharacters />
    </article>
  );
};
export default Page;
