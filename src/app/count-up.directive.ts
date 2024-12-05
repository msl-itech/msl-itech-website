import { Directive, ElementRef, Input } from '@angular/core';

@Directive({
  selector: '[appCountUp]'
})
export class CountUpDirective {
  @Input('appCountUp') endValue: number = 0; // Valeur finale
  @Input() duration: number = 2000; // Durée totale en ms

  constructor(private el: ElementRef) {}

  ngOnInit() {
    this.startCount();
  }

  private startCount() {
    const element = this.el.nativeElement;
    const startValue = 0;
    const endValue = this.endValue;
    const duration = this.duration;

    const startTime = performance.now();

    const animate = (currentTime: number) => {
      const elapsedTime = currentTime - startTime;
      const progress = Math.min(elapsedTime / duration, 1); // [0,1]
      const currentValue = startValue + (endValue - startValue) * progress;

      element.textContent = currentValue.toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });

      if (progress < 1) {
        requestAnimationFrame(animate);
      }
    };

    requestAnimationFrame(animate);
  }
}
