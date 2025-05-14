import { AfterViewInit, Component, ElementRef, ViewChild } from '@angular/core';
import { iframeResizer } from 'iframe-resizer';

@Component({
  selector: 'app-job',
  templateUrl: './job.component.html',
  styleUrls: ['./job.component.css'],
})
export class JobComponent implements AfterViewInit {
  @ViewChild('jobIframe', { static: true })
  iframeRef!: ElementRef<HTMLIFrameElement>;

  ngAfterViewInit(): void {
    setTimeout(() => {
      try {
        console.log('Initializing iframe resizer...');
        iframeResizer(
          {
            log: true,
            checkOrigin: false,
            heightCalculationMethod: 'lowestElement',
            resizeFrom: 'child',
            scrolling: true,
            warningTimeout: 0,
            inPageLinks: true,
            autoResize: true,
            onInit: function () {
              console.log('iframe initialized');
            },
          },
          this.iframeRef.nativeElement
        );
      } catch (error) {
        console.error('Error initializing iframe resizer:', error);
      }
    }, 500);
  }
}
