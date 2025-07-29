import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { delay, filter } from 'rxjs/operators';

interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumbs',
  standalone: false,
  templateUrl: './breadcrumbs.component.html',
  styleUrl: './breadcrumbs.component.scss',
})
export class BreadcrumbsComponent implements OnInit {
  breadcrumbs: Array<{ label: string; url: string }> = [];

  constructor(private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    // Watch for route changes
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        delay(0)
      )
      .subscribe(() => {
        this.breadcrumbs = this.buildBreadcrumb(this.route.root);
      });

    // 💥 Force breadcrumb build on initial load
    setTimeout(() => {
      this.breadcrumbs = this.buildBreadcrumb(this.route.root);
    });
  }

  private buildBreadcrumb(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    const children: ActivatedRoute[] = route.children;

    if (
      route.routeConfig &&
      route.routeConfig.data &&
      route.routeConfig.data['breadcrumb']
    ) {
      const routeURL: string = route.routeConfig.path || '';
      const nextUrl = `${url}/${routeURL}`;
      const breadcrumb: Breadcrumb = {
        label: this.formatLabel(route.routeConfig.data['breadcrumb']),
        url: nextUrl,
      };
      breadcrumbs.push(breadcrumb);
      url = nextUrl;
    }

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (let child of children) {
      return this.buildBreadcrumb(child, url, breadcrumbs); // Keep recursing
    }

    return breadcrumbs;
  }

  private formatLabel(label: string): string {
    return label
      .replace(/-/g, ' ') // Replace hyphens with spaces
      .replace(/\b\w/g, (char) => char.toUpperCase()); // Capitalize each word
  }
  cleanUrl(url: string): string {
  return url.replace(/^\/+/, '');
}
}
