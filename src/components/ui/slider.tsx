import * as React from 'react'
import * as SliderPrimitive from '@radix-ui/react-slider'

type SliderProps = React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>

const Slider = React.forwardRef<
  React.ElementRef<typeof SliderPrimitive.Root>,
  SliderProps
>(({ className, orientation = 'horizontal', ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    orientation={orientation}
    className={[
      'relative flex touch-none select-none',
      orientation === 'vertical'
        ? 'flex-col items-center w-6'
        : 'flex-row items-center w-full',
      className,
    ]
      .filter(Boolean)
      .join(' ')}
    {...props}
  >
    <SliderPrimitive.Track
      className={[
        'relative overflow-hidden rounded-full bg-wp-contour',
        orientation === 'vertical' ? 'w-2 grow' : 'h-2 w-full grow',
      ].join(' ')}
    >
      <SliderPrimitive.Range
        className={[
          'absolute bg-wp-accent',
          orientation === 'vertical' ? 'w-full' : 'h-full',
        ].join(' ')}
      />
    </SliderPrimitive.Track>
    <SliderPrimitive.Thumb
      className="block w-7 h-7 rounded-full border-2 border-wp-accent bg-white shadow-md ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-wp-accent focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-grab active:cursor-grabbing"
    />
  </SliderPrimitive.Root>
))

Slider.displayName = SliderPrimitive.Root.displayName

export { Slider }
