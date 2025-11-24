import { ExternalLink } from "lucide-react";

interface ProjectCardProps {
  title: string;
  description: string;
  image?: string;
  link: string;
  tags?: string[];
}

export default function ProjectCard({
  title,
  description,
  image,
  link,
  tags = [],
}: ProjectCardProps) {
  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex flex-col h-full bg-card border border-border rounded-2xl overflow-hidden transition-all duration-300 hover:border-accent hover:shadow-lg hover:shadow-accent/10 hover:-translate-y-1"
    >
      {image && (
        <div className="relative w-full h-56 overflow-hidden bg-muted">
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        </div>
      )}
      
      <div className="flex flex-col flex-1 p-6 md:p-7">
        <h3 className="text-lg font-semibold text-foreground mb-3 group-hover:text-accent transition-colors line-clamp-2">
          {title}
        </h3>
        
        <p className="text-foreground/70 text-sm mb-4 line-clamp-3 flex-1 leading-relaxed">
          {description}
        </p>
        
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-5">
            {tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-muted text-muted-foreground text-xs font-medium rounded-full"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        
        <div className="flex items-center gap-2 text-accent font-medium text-sm group-hover:gap-3 transition-all">
          View Project
          <ExternalLink className="w-4 h-4" />
        </div>
      </div>
    </a>
  );
}
