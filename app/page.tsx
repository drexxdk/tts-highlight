"use client";

const Page = () => {
  return (
    <article className="grid gap-8">
      <section>
        <h2 className="font-bold text-xl">Features</h2>
        <ul className="list-inside list-disc">
          <li>Selected text player</li>
          <li>Previous/Next sentence button functionality</li>
          <li>
            Selection that stays until the player closes (Except for Firefox)
          </li>
          <li>Selection across different react components</li>
          <li>Active word highlight (Except for Firefox)</li>
          <li>Polly integration</li>
          <li>No rerender of react components for TTS or Highlight</li>
          <li>
            Reads and highlights correctly on all tested markup structures
          </li>
          <li>Works on all browsers and devices</li>
          <li>
            Punctuations on sentence endings for text given to polly, to get
            correct sentences. Polly would think all "li" items was one big
            sentence since the text within them doesnt end with: . or ! or ?
          </li>
        </ul>
      </section>
      <section>
        <h2 className="font-bold text-xl">ToDo</h2>
        <ul className="list-inside list-disc">
          <li>Full page player</li>
          <li>
            Switch polly audio files when needed (it only uses first file
            currently)
          </li>
          <li>Change voice</li>
          <li>Change reading speed</li>

          <li>Custom text used for reader on elements</li>
        </ul>
      </section>
      <section>
        <h2 className="font-bold text-xl">Wish list</h2>
        <ul className="list-inside list-disc">
          <li>
            Firefox Highlight API support{" "}
            <a
              href="https://bugzilla.mozilla.org/show_bug.cgi?id=1703961"
              className="underline hover:no-underline text-orange-300"
            >
              https://bugzilla.mozilla.org/show_bug.cgi?id=1703961
            </a>
          </li>
          <li>Auto detect text language</li>
          <li>Support multiple spoken languages at the same time</li>
          <li>Audio streaming instead of mp3</li>
          <li>Duration slider</li>
          <li>
            Some way of giving ::highlight higher z-index than ::selection
          </li>
          <li>More options for ::highlight styling</li>
        </ul>
      </section>
      <section>
        <h2 className="font-bold text-xl">Test content</h2>
        <div>
          <p>This is a long paragraph with many different words.</p>
          <ol className="list-decimal list-inside">
            <li>
              This is a <b>list</b> item.
            </li>
            <li>
              One{" "}
              <u>
                Two <b>Three Four</b>Five Six Seven <b>Eight</b>9 10...
              </u>
              !&quot;,.?&apos;
            </li>
            <li>Random symbol test ??!"#¤""!%&/()=?"</li>
          </ol>
          <p>This is amazing!</p>
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed rutrum
            eros velit, in iaculis mi tempor sed. Ut odio odio, aliquet eu elit
            ac, ornare efficitur risus. Sed massa est, consectetur non ipsum eu,
            vehicula suscipit mi. Vestibulum sollicitudin sagittis neque, vitae
            aliquet neque vulputate in. Nunc sem odio, porttitor nec felis ac,
            fermentum scelerisque ante. Suspendisse viverra sodales convallis.
            Sed non velit vitae nibh consectetur efficitur. Pellentesque
            consectetur in leo quis interdum. Sed diam ligula, vestibulum sit
            amet interdum non, tincidunt in metus. Aliquam porta molestie erat
            at molestie. Pellentesque lobortis hendrerit lorem tempus ultricies.
            Curabitur ut magna vel libero tincidunt sollicitudin.
          </p>
          <p>
            Mauris hendrerit turpis sit amet elementum rhoncus. Curabitur et
            turpis sed velit efficitur lobortis elementum non turpis. Nulla
            dignissim in urna sed vulputate. Integer consectetur metus non
            ligula vehicula consequat. Orci varius natoque penatibus et magnis
            dis parturient montes, nascetur ridiculus mus. Pellentesque aliquam
            sed orci vel fermentum. Mauris gravida venenatis erat, sit amet
            volutpat tortor tincidunt a. Morbi efficitur condimentum turpis, at
            tristique orci. Sed placerat ac risus vitae tempor. Aliquam
            consectetur nisi sit amet mollis varius.
          </p>
          <p>
            Morbi sagittis risus tincidunt ipsum fringilla, ac tempor sapien
            condimentum. Suspendisse condimentum volutpat euismod. Ut neque
            augue, condimentum sed euismod eu, eleifend malesuada purus. In
            pretium nunc magna, id commodo urna mattis at. Sed bibendum, dolor
            vel commodo placerat, justo justo dictum est, non auctor erat nibh
            ac erat. Pellentesque habitant morbi tristique senectus et netus et
            malesuada fames ac turpis egestas. Cras lacinia arcu in ex commodo
            fermentum.
          </p>
          <p>
            Aliquam vitae quam tempus, pharetra massa at, commodo leo. Donec
            vulputate sapien a risus commodo, eget blandit arcu semper. In
            tincidunt in nunc imperdiet lacinia. Vestibulum ac velit volutpat,
            facilisis nibh et, varius erat. Integer dapibus leo eget nisi
            efficitur, eu ornare dui sagittis. Nam a ullamcorper justo, ac
            efficitur elit. Vestibulum ornare, dui nec convallis tincidunt,
            nulla urna laoreet massa, non rutrum magna ligula quis felis. Cras
            pretium nibh sem, non rhoncus risus volutpat in. Suspendisse
            fermentum dignissim est. Cras accumsan sem quis ipsum vehicula
            viverra.
          </p>
          <p>
            Aliquam congue nec justo eu consequat. Vestibulum vel enim nec massa
            scelerisque fringilla. Nulla gravida eleifend ligula, vitae placerat
            nunc suscipit id. Donec ut mollis lectus. Curabitur et lorem nisl.
            Integer vel mi a magna finibus tincidunt. Mauris scelerisque ligula
            nec ipsum laoreet laoreet. Aliquam erat volutpat. Vestibulum at urna
            dolor.
          </p>
        </div>
      </section>
    </article>
  );
};
export default Page;
