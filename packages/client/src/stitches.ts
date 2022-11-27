import { createStitches } from '@stitches/react'
import { blue, red, gray, blackA, whiteA } from '@radix-ui/colors'

export const { styled, css } = createStitches({

    theme: {

        colors: {
            black: '#000',
            ...blackA,
            white: '#fff',
            ...whiteA,
            ...gray,
            primary: blue.blue9,
            primary1: blue.blue1,
            primary3: blue.blue3,
            primary4: blue.blue4,
            primary5: blue.blue5,
            primary9: blue.blue9,
            primary10: blue.blue10,
            primary11: blue.blue11,
            failure: red.red9,
            failure1: red.red1,
            failure10: red.red10,
            failure11: red.red11,
            separator: blackA.blackA6,
        },

        fonts: {

        },

        fontSizes: {
            1: '12px',
            2: '14px',
            3: '16px',
        },

        lineHeights: {
            1: '16px',
        },

        radii: {
            1: '4px',
            2: '8px',
        },

        sizes: {
            xs: '360px',
            sm: '600px',
            md: '900px',
        },

        space: {
            1: '8px',
            2: '16px',
            3: '24px',
        },

        shadows: {
            box0: '0px 0px 0px 0px rgba(0, 0, 0, 0.1), 0px 0px 0px 0px rgba(0, 0, 0, 0.08), 0px 0px 0px 0px rgba(0, 0, 0, 0.06)',
            boxInset0: 'inset 0px 0px 0px 0px rgba(0, 0, 0, 0.1), inset 0px 0px 0px 0px rgba(0, 0, 0, 0.08), inset 0px 0px 0px 0px rgba(0, 0, 0, 0.06)',
            box1: '0px 2px 1px -1px rgba(0, 0, 0, 0.1), 0px 1px 1px 0px rgba(0, 0, 0, 0.08), 0px 1px 3px 0px rgba(0, 0, 0, 0.06)',
            box2: '0px 3px 1px -2px rgba(0, 0, 0, 0.1), 0px 2px 2px 0px rgba(0, 0, 0, 0.08), 0px 1px 5px 0px rgba(0, 0, 0, 0.06)',
            boxSoft2: '0px 3px 1px -2px rgba(0, 0, 0, 0.05), 0px 2px 2px 0px rgba(0, 0, 0, 0.04), 0px 1px 5px 0px rgba(0, 0, 0, 0.03)',
            boxSoftInset2: 'inset 0px 3px 1px -2px rgba(0, 0, 0, 0.05), inset 0px 2px 2px 0px rgba(0, 0, 0, 0.04), inset 0px 1px 5px 0px rgba(0, 0, 0, 0.03)',
            boxInset2: 'inset 0px 3px 1px -2px rgba(0, 0, 0, 0.1), inset 0px 2px 2px 0px rgba(0, 0, 0, 0.08), inset 0px 1px 5px 0px rgba(0, 0, 0, 0.06)',
            box3: '0px 3px 3px -2px rgba(0, 0, 0, 0.1), 0px 3px 4px 0px rgba(0, 0, 0, 0.08), 0px 1px 8px 0px rgba(0, 0, 0, 0.06)',
            box4: '0px 2px 4px -1px rgba(0, 0, 0, 0.1), 0px 4px 5px 0px rgba(0, 0, 0, 0.08), 0px 1px 10px 0px rgba(0, 0, 0, 0.06)',
            boxSoft4: '0px 2px 4px -1px rgba(0, 0, 0, 0.05), 0px 4px 5px 0px rgba(0, 0, 0, 0.04), 0px 1px 10px 0px rgba(0, 0, 0, 0.03)',
            box6: '0 3px 5px -1px rgba(0, 0, 0, 0.1), 0 6px 10px 0 rgba(0, 0, 0, 0.08), 0 1px 18px 0 rgba(0, 0, 0, 0.06)',
            box8: '0 5px 5px -3px rgba(0, 0, 0, 0.1), 0 8px 10px 1px rgba(0, 0, 0, 0.08), 0 3px 14px 2px rgba(0, 0, 0, 0.06)',
            boxSoft8: '0 5px 5px -3px rgba(0, 0, 0, 0.05), 0 8px 10px 1px rgba(0, 0, 0, 0.04), 0 3px 14px 2px rgba(0, 0, 0, 0.03)',
            box12: '0 7px 8px -4px rgba(0, 0, 0, 0.1), 0 12px 17px 2px rgba(0, 0, 0, 0.08), 0 5px 22px 4px rgba(0, 0, 0, 0.06)',
            box16: '0 8px 10px -5px rgba(0, 0, 0, 0.1), 0 16px 24px 2px rgba(0, 0, 0, 0.08), 0 6px 30px 5px rgba(0, 0, 0, 0.06)',
            boxSoft16: '0 8px 10px -5px rgba(0, 0, 0, 0.05), 0 16px 24px 2px rgba(0, 0, 0, 0.04), 0 6px 30px 5px rgba(0, 0, 0, 0.03)',
            box24: '0 24px 38px 3px rgba(0, 0, 0, 0.1), 0 9px 46px 8px rgba(0, 0, 0, 0.08), 0 11px 15px -7px rgba(0, 0, 0, 0.06)',
        },

        zIndices: {
            dialog: 1000,
            toast: 10000,
        },

    },

    media: {
        smDown: '(max-width: 599px)',
        smUp: '(min-width: 600px)',
        mdDown: '(max-width: 899px)',
        mdUp: '(min-width: 900px)',
        lgDown: '(max-width: 1199px)',
        lgUp: '(min-width: 1200px)',
        xlDown: '(max-width: 1535px)',
        xlUp: '(min-width: 1536px)',
    },

})
