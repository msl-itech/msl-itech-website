import { Component } from '@angular/core';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css',
})
export class ContactComponent {
  // isLoading: boolean = true; // Indicateur de chargement
  // constructor(private spinner: NgxSpinnerService) {}
  // @ViewChild('odooIframe', { static: false }) iframe!: ElementRef; // Référence à l'iframe
  // ngOnInit(): void {
  //   this.spinner.show();
  //   this.adjustHeight();
  //   setTimeout(() => {
  //     /** spinner ends after 5 seconds */
  //     this.spinner.hide();
  //   }, 1000);
  //   window.addEventListener('message', (event) => {
  //   // On vérifie que c'est bien notre message attendu
  //   if (event.data && event.data.type === 'IFRAME_BOTTOM_REACHED') {
  //     // Ici, l'iframe est arrivé en bas.
  //     // Vous pouvez par exemple forcer un léger défilement du parent
  //     // ou mettre un indicateur visuel pour montrer que le scrolling parent est disponible.
  //     // Par exemple, on peut tenter un petit scroll du parent pour "sortir" du focus iframe.
  //     window.scrollBy(0, 1);
  //   }
  // });
  // }
  // @HostListener('window:resize')
  // adjustHeight() {
  //   const iframeContainer = document.getElementById('iframeContainer');
  //   if (iframeContainer) {
  //     iframeContainer.style.height = `${window.innerHeight}px`;
  //   }
  // }
  // @ViewChild('iframe') iframe: ElementRef<HTMLIFrameElement> | undefined;
  // ngOnInit() {
  //   // Écouter les messages provenant de l'iframe
  //   window.addEventListener('message', (event) => {
  //     if (event.data?.type === 'IFRAME_HEIGHT' && this.iframe) {
  //       const iframeElement = this.iframe.nativeElement;
  //       // Ajuster la hauteur de l'iframe selon la hauteur reçue
  //       iframeElement.style.height = `${event.data.height}px`;
  //     }
  //   });
  // }
}
