import Image from "next/image";

export default function MakerNote() {
  return (
    <section className="bx-section" id="why">
      <div className="bx-wrap">
        <div className="bx-maker">
          <Image src="/images/corey.jpg" alt="Corey Haines" width={76} height={76} />
          <div>
            <span className="bx-strip">Why it exists</span>
            <p>
              I copy things all day, from code and links to addresses and screenshots, and I kept
              losing the one I needed a few copies back. The clipboard managers I tried either sent
              my history somewhere or cost a subscription, and some happily saved my passwords. So I
              built the one I wanted: it keeps everything on my Mac, skips passwords and keys, and
              finds any clip in a second. And it&apos;s free.
            </p>
            <cite>
              Corey Haines, maker of On Hand and <a href="#apps">more free Mac apps</a>
            </cite>
          </div>
        </div>
      </div>
    </section>
  );
}
