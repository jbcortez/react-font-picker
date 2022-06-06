export const loadStylesheet = (
  href: string,
  family: string,
  isPreview: boolean = false
) => {
  if ('document' in window) {
    let link: HTMLLinkElement;

    // check if stylesheet exists
    if (isPreview) {
      link = document.getElementById(
        `${family}-preview-stylesheet`
      ) as HTMLLinkElement;
    } else {
      link = document.getElementById(
        'active-font-stylesheet'
      ) as HTMLLinkElement;
    }

    // Remove stylesheet if it exists
    if (link?.parentNode) {
      link.parentNode.removeChild(link);
    }

    // Create new stylesheet
    const styles = document.createElement('link');
    styles.rel = 'stylesheet';
    styles.href = href;

    if (isPreview) {
      styles.id = `${family}-preview-stylesheet`;
    } else {
      styles.id = 'active-font-stylesheet';
    }

    // Add stylesheet to document
    document.getElementsByTagName('head')[0].appendChild(styles);
  }
};

export const loadPreviewStylesheet = (url: string) => {
  if ('document' in window) {
    // Check if stylesheet exists
    const link = document.getElementById(
      'preview-fonts-stylesheet'
    ) as HTMLLinkElement;

    // Remove stylesheet if it exists
    if (link) {
      link.remove();
    }

    // Create new stylesheet
    const styles = document.createElement('link');
    styles.rel = 'stylesheet';
    styles.href = url;
    styles.id = 'preview-fonts-stylesheet';

    // Append stylesheet to document
    document.getElementsByTagName('head')[0].appendChild(styles);
  }
};
