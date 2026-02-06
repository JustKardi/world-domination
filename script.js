const allPaths = document.querySelectorAll('path');
const toolTip = document.getElementById('tooltip');
const title = document.getElementById('countryTitle');
let selectedCountry;

allPaths.forEach(path => {
    path.addEventListener('mouseenter', () => {
        const countryClass = path.classList[0];
        const countryName = path.getAttribute('name') || path.classList;

        toolTip.innerText = countryName;
        toolTip.style.display = 'block';
        
        if (countryClass) {
            document.querySelectorAll('.' + countryClass).forEach(island => {
                island.classList.add('highlight');
            });
        } else {
            path.classList.add('highlight');
        }
    });

    path.addEventListener('mousemove', (e) => {
        toolTip.style.left = (e.pageX + 15) + 'px';
        toolTip.style.top = (e.pageY + 15) + 'px';
    })

    path.addEventListener('mouseleave', () => {

        toolTip.style.display = 'none';

        const countryClass = path.classList[0];
        
        if (countryClass) {
            document.querySelectorAll('.' + countryClass).forEach(island => {
                island.classList.remove('highlight');
            });
        } else {
            path.classList.remove('highlight');
        }
    });

    path.addEventListener('mousedown', () => {

        document.querySelectorAll('path').forEach(p => {
            p.classList.remove('activeCountry');
        });

        path.classList.remove('highlight');

        const countryClass = path.classList[0];

        const countryCode = path.getAttribute('name') || path.classList.value;

        selectedCountry = countryCode;
        title.textContent = selectedCountry;

        if (countryClass) {
            document.querySelectorAll('.' + countryClass).forEach(island => {
                island.classList.add('activeCountry');
            });
        } else {
            path.classList.add('activeCountry');
        }
    });


});
