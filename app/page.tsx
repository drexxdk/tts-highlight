'use client';

import SpecialCharacters from '@/features/tts/components/SpecialCharacters';
import { Disclosure, DisclosureButton, DisclosurePanel } from '@headlessui/react';
import Image from 'next/image';
import { ReactNode } from 'react';
import { FaAngleDown } from 'react-icons/fa6';

const Ol = ({ children }: { children: ReactNode }) => {
  return <ol className="grid list-inside list-decimal gap-1">{children}</ol>;
};

const Accordion = ({
  buttonText,
  children,
  defaultOpen = false,
}: {
  buttonText: string;
  children: ReactNode;
  defaultOpen?: boolean;
}) => {
  return (
    <Disclosure as={'div'} className="grid" defaultOpen={defaultOpen}>
      <DisclosureButton className="group/button flex items-center justify-between bg-zinc-900 px-4 py-2 hover:bg-zinc-800">
        <span>{buttonText}</span>
        <FaAngleDown className="group-data-[open]/button:rotate-180" />
      </DisclosureButton>
      <DisclosurePanel className="border-t-2 border-zinc-900 p-4">{children}</DisclosurePanel>
    </Disclosure>
  );
};

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
    <article className="grid divide-y-2 divide-zinc-900 border-2 border-zinc-900">
      <Accordion buttonText="data-tts-replace & data-tts-ignore" defaultOpen={true}>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <p>
              <span className="tts-replace">The blue text</span> elements is replaced with other text for TTS.
            </p>
            <p>
              <span className="tts-ignore">The red text</span> elements is ignored by TTS.
            </p>
          </div>
          <Ol>
            <li>
              &quot;I choose to run <span data-tts-replace="toward my">away from</span> problems and not away from them.
              Because that - Because that&apos;s what heroes do.&quot;
            </li>
            <li>
              <span data-tts-replace="Fear controls us all">
                &quot;I can&apos;t control their fear, only my own.&quot;
              </span>
            </li>
            <li>
              &quot;It&apos;s <span data-tts-ignore>not</span> enough to be against something. You have to be for
              something better.&quot;
            </li>
            <li>
              &quot;Good is not a thing you are. <span data-tts-ignore>It&apos;s a thing you do</span>.&quot;
            </li>
            <li>
              &quot;You were wrong, all of you were wrong, to turn your backs on <span data-tts-ignore>the</span>{' '}
              <span data-tts-ignore>rest</span> <span data-tts-ignore>of</span> the world! We let the fear of discovery
              stop us <span data-tts-ignore>from doing what is right</span>.&quot;
            </li>
            <li>
              &quot;Higher, <span data-tts-replace="longer">further</span>, faster,{' '}
              <span data-tts-replace="buddy">baby</span>.&quot;
            </li>
            <li>
              &quot;The hardest choices require the <span data-tts-replace="weakest">strongest</span>{' '}
              <span data-tts-replace="weapons">wills</span>.&quot;
            </li>
            <li>
              &quot;You <span data-tts-replace="except nothing">hope for the best</span>{' '}
              <span data-tts-replace="but hope for">and make do with what</span>{' '}
              <span data-tts-replace="something">you get</span>.&quot;
            </li>
            <li data-tts-replace>&quot;I would rather be a good man than a great king.&quot;</li>
            <li>&quot;Part of the journey is the end.&quot;</li>
            <li>&quot;Just because something works, doesn&apos;t mean it can&apos;t be improved.&quot;</li>
            <li>
              <span data-tts-ignore>&quot;Avengers,</span> assemble!&quot;
            </li>
            <li>
              &quot;No man can win <span data-tts-ignore>every battle</span>, but no man should fall without{' '}
              <span data-tts-replace="effort">struggle.&quot;</span>
            </li>
            <li>
              &quot;We never <span data-tts-replace="defeat">lose</span> our demons, Mordo. We only learn to live above
              them.&quot;
            </li>
            <li>
              &quot;But what is <span data-tts-replace="it">grief</span>, if not love persevering?&quot;
            </li>
            <li>
              &quot;All <span data-tts-replace="they">we</span> can do is <span data-tts-replace="their">our</span>{' '}
              best, and sometimes the best that we can do is to start over.&quot;
            </li>
            <li>&quot;No amount of money ever bought a second of time.&quot;</li>
            <li>
              &quot;<span data-tts-replace="Everything">Nothing</span> goes over my head. My reflexes are too fast.{' '}
              <span data-tts-replace="We will">I would</span> catch it.&quot;
            </li>
            <li>
              &quot;How is <span data-tts-replace="always">never</span> as important as why.&quot;
            </li>
            <li>
              &quot;
              <span data-tts-replace="We are the product of all that came before us, the legacy of our family">
                You are the product of all who came before you, the legacy of your family.
              </span>
              &quot;
            </li>
            <li>
              &quot;Love is a <span data-tts-replace="power">dagger</span>. It&apos;s a weapon to be wielded far away or
              up close. You can see yourself in it. It&apos;s beautiful{' '}
              <span data-tts-ignore>until it makes you bleed.&quot;</span>
            </li>
            <li>
              &quot;You seek <span data-tts-replace="happiness">love</span>. It&apos;s all any of us want.&quot;
            </li>
            <li>
              &quot;It&apos;s not about how much we <span data-tts-replace="win">lost</span>, it&apos;s about how much{' '}
              <span data-tts-replace="others lose">we have left</span>.&quot;
            </li>
            <li>
              &quot;At some point, we all have to <span data-tts-replace="give up">choose</span>,{' '}
              <span data-tts-replace="on">between</span> what <span data-tts-replace="we">the world</span>{' '}
              <span data-tts-replace="want">wants you to be, and who you are</span>.&quot;
            </li>
            <li>
              &quot;If you&apos;re nothing without this <span data-tts-replace="hat">suit</span>, then you
              shouldn&apos;t have it.&quot;
            </li>
          </Ol>
        </div>
      </Accordion>
      <Accordion buttonText="Unmodified quotes">
        <Ol>
          <li>
            &quot;I choose to run toward my problems and not away from them. Because that - Because that&apos;s what
            heroes do.&quot;
          </li>
          <li>&quot;I can&apos;t control their fear, only my own.&quot;</li>
          <li>&quot;It&apos;s not enough to be against something. You have to be for something better.&quot;</li>
          <li>&quot;Good is not a thing you are. It&apos;s a thing you do.&quot;</li>
          <li>
            &quot;You were wrong, all of you were wrong, to turn your backs on the rest of the world! We let the fear of
            discovery stop us from doing what is right.&quot;
          </li>
          <li>&quot;Higher, further, faster, baby.&quot;</li>
          <li>&quot;The hardest choices require the strongest wills.&quot;</li>
          <li>&quot;You hope for the best and make do with what you get.&quot;</li>
          <li>&quot;I would rather be a good man than a great king.&quot;</li>
          <li>&quot;Part of the journey is the end.&quot;</li>
          <li>&quot;Just because something works, doesn&apos;t mean it can&apos;t be improved.&quot;</li>
          <li>&quot;Avengers, assemble!&quot;</li>
          <li>&quot;No man can win every battle, but no man should fall without struggle.&quot;</li>
          <li>&quot;We never lose our demons, Mordo. We only learn to live above them.&quot;</li>
          <li>&quot;But what is grief, if not love persevering?&quot;</li>
          <li>&quot;All we can do is our best, and sometimes the best that we can do is to start over.&quot;</li>
          <li>&quot;No amount of money ever bought a second of time.&quot;</li>
          <li>&quot;Nothing goes over my head. My reflexes are too fast. I would catch it.&quot;</li>
          <li>&quot;How is never as important as why.&quot;</li>
          <li>&quot;You are the product of all who came before you, the legacy of your family.&quot;</li>
          <li>
            &quot;Love is a dagger. It&apos;s a weapon to be wielded far away or up close. You can see yourself in it.
            It&apos;s beautiful until it makes you bleed.&quot;
          </li>
          <li>&quot;You seek love. It&apos;s all any of us want.&quot;</li>
          <li>&quot;It&apos;s not about how much we lost, it&apos;s about how much we have left.&quot;</li>
          <li>
            &quot;At some point, we all have to choose, between what the world wants you to be, and who you are.&quot;
          </li>
          <li>&quot;If you&apos;re nothing without this suit, then you shouldn&apos;t have it.&quot;</li>
        </Ol>
      </Accordion>
      <Accordion buttonText="hidden / invisible elements" defaultOpen={true}>
        <div className="grid gap-6">
          <p>
            There is several <span className="code">display=&quot;none&quot;</span> and{' '}
            <span className="code">visibility=&quot;hidden&quot;</span> elements, within this list.
          </p>
          <Ol>
            <li>A</li>
            <li className="hidden">B</li>
            <li>C</li>
            <li>
              D <span className="invisible">E</span> F <span className="hidden">G</span> H
            </li>
            <li>
              I{' '}
              <span>
                J{' '}
                <span className="hidden">
                  K <span className="invisible">L</span>
                </span>
              </span>{' '}
              M <span className="invisible">N</span>
            </li>
            <li>
              O{' '}
              <span className="invisible">
                P <span className="hidden">Q</span>
              </span>
            </li>
            <li>R</li>
          </Ol>
        </div>
      </Accordion>
      <Accordion buttonText="Form">
        <div className="grid gap-6">
          <p>Not supported yet</p>
          <input
            className="border border-gray-500 bg-white p-4 text-gray-950"
            type="text"
            defaultValue={'Mauris hendrerit turpis sit amet elementum rhoncus.'}
          />

          <textarea
            className="border border-gray-500 bg-white p-4 text-gray-950"
            rows={6}
            defaultValue={`Mauris hendrerit turpis sit amet elementum rhoncus. Curabitur et turpis sed velit efficitur lobortis
elementum non turpis. Nulla dignissim in urna sed vulputate.`}
          ></textarea>
        </div>
      </Accordion>
      <Accordion buttonText="Special Charactersaaa" defaultOpen={true}>
        <div className="grid gap-6">
          <p>This is used to test character support for Polly, on different languages.</p>
          <SpecialCharacters />
        </div>
      </Accordion>
      <Accordion buttonText="Random stuff for testing">
        <div className="grid gap-2">
          <ul>
            <li>
              <span data-tts-replace>Tester</span>
            </li>
            <li>
              This is{' '}
              <span data-tts-replace="Crazy... St . uff he.lo man!" className="bg-red-500">
                just{' '}
                <span className="bg-yellow-500">
                  another{' '}
                  <span className="bg-blue-500">
                    wild <span className="bg-pink-500">test</span>
                  </span>
                </span>
              </span>{' '}
              a test
            </li>
          </ul>
          <p>
            Ignore
            <span className="bg-red-500" data-tts-ignore>
              THIS SHOULD BE IGNORED
            </span>
            part
          </p>
          <p>
            Ignore{' '}
            <span className="bg-red-500" data-tts-ignore>
              THIS SHOULD BE IGNORED
            </span>{' '}
            part
          </p>
          <p>This is a long paragraph with many different words.</p>
          <ol className="list-inside list-decimal">
            <li>
              This is a <b>list</b>&nbsp;&nbsp;&nbsp;item.
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
            Lorem ipsum dolor sit amet, consectetur adipiscing <span className="bg-blue-500">elit</span>.... Sed rutrum
            eros velit, in iaculis mi tempor sed. Ut odio odio, aliquet eu elit ac, ornare efficitur risus. Sed massa
            est, consectetur non ipsum eu, vehicula suscipit mi. Vestibulum sollicitudin sagittis neque, vitae aliquet
            neque vulputate in. Nunc sem odio, porttitor nec felis ac, fermentum scelerisque ante. Suspendisse viverra
            sodales convallis. Sed non velit vitae nibh consectetur efficitur. Pellentesque consectetur in leo quis
            interdum. Sed diam ligula, vestibulum sit amet interdum non, tincidunt in metus. Aliquam porta molestie erat
            at molestie. Pellentesque lobortis hendrerit lorem tempus ultricies. Curabitur ut magna vel libero tincidunt
            sollicitudin.
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
          <div className="grid gap-4 sm:grid-cols-2">
            <StackedCard />
            <StackedCard />
          </div>
        </div>
      </Accordion>
    </article>
  );
};
export default Page;
