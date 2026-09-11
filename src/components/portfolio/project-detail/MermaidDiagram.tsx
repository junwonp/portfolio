import Image from 'next/image';
import diagrams from '@/generated/diagrams.json';
import * as styles from './MermaidDiagram.css';

interface Props {
  chart: string;
  eyebrow?: string;
  title: string;
}

interface DiagramAsset {
  light: string;
  dark: string;
  width: number;
  height: number;
}

export default function MermaidDiagram({ chart, eyebrow = 'Diagram', title }: Props) {
  const asset = (diagrams as Record<string, DiagramAsset>)[chart];
  if (!asset) throw new Error('Diagram asset is missing. Run the diagram generation script.');

  return (
    <figure className={styles.mermaidDiagram} aria-label={title}>
      <figcaption className={styles.diagramHeader}>
        <span>{eyebrow}</span>
        <strong>{title}</strong>
      </figcaption>
      <div className={styles.diagramFrame}>
        <Image
          className={styles.lightDiagram}
          src={asset.light}
          width={asset.width}
          height={asset.height}
          alt=""
          unoptimized
        />
        <Image
          className={styles.darkDiagram}
          src={asset.dark}
          width={asset.width}
          height={asset.height}
          alt=""
          unoptimized
        />
      </div>
    </figure>
  );
}
