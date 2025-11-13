document.addEventListener('DOMContentLoaded', () => {

    // --- CONFIGURAÇÕES GERAIS ---
    const PRODUCT_PRICE = 489;
    const COMMISSION_RATE = 0.20; // 20%
    const COMMISSION_PER_SALE = PRODUCT_PRICE * COMMISSION_RATE;
    const CREATOR_WHATSAPP = "5543991862510";

    // --- SELEÇÃO DE ELEMENTOS ---
    const themeSwitch = document.querySelector('.theme-switch__checkbox');
    const followersInput = document.getElementById('followers');
    const conversionSlider = document.getElementById('conversion');
    const conversionValueSpan = document.getElementById('conversion-value');
    const resultsSection = document.getElementById('results');
    const kpiSales = document.getElementById('kpi-sales');
    const kpiEarningsY1 = document.getElementById('kpi-earnings-y1');
    const kpiEarningsY5 = document.getElementById('kpi-earnings-y5');
    const talkToCreatorBtn = document.getElementById('talk-to-creator-btn');
    const chartCanvas = document.getElementById('earningsChart').getContext('2d');
    let earningsChart;

    // --- LÓGICA DO TEMA (CLARO/ESCURO) ---
    const applyTheme = (theme) => {
        if (theme === 'dark') {
            document.body.classList.add('dark-mode');
            themeSwitch.checked = true;
        } else {
            document.body.classList.remove('dark-mode');
            themeSwitch.checked = false;
        }
    };

    const savedTheme = localStorage.getItem('theme') || 'light';
    applyTheme(savedTheme);

    themeSwitch.addEventListener('change', () => {
        const newTheme = themeSwitch.checked ? 'dark' : 'light';
        localStorage.setItem('theme', newTheme);
        applyTheme(newTheme);
        calculateAndDisplay();
    });

    // --- FUNÇÕES DA CALCULADORA ---
    const formatCurrency = (value) => {
        return value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
    };

    const calculateAndDisplay = () => {
        const followers = parseInt(followersInput.value) || 0;
        const conversionRate = parseFloat(conversionSlider.value);

        conversionValueSpan.textContent = `${conversionRate.toFixed(2)}%`;

        // Lógica de cálculo CORRIGIDA
        const initialSales = Math.round(followers * (conversionRate / 100));
        const firstYearEarnings = initialSales * COMMISSION_PER_SALE;

        // Projeção REALISTA para 5 anos - CORRIGIDA
        let cumulativeEarnings = 0;
        let recurringClients = initialSales; // Apenas clientes que renovam
        const chartData = [];
        const chartLabels = [];
        
        const retentionRate = 0.8; // 80% renovam
        // REMOVIDA a taxa de novas vendas anuais para evitar crescimento infinito

        for (let year = 1; year <= 5; year++) {
            let currentYearEarnings = 0;
            
            if (year === 1) {
                // Ano 1: apenas vendas iniciais
                currentYearEarnings = recurringClients * COMMISSION_PER_SALE;
            } else {
                // Anos 2-5: apenas clientes que renovam (sem novas vendas)
                recurringClients = Math.round(recurringClients * retentionRate);
                currentYearEarnings = recurringClients * COMMISSION_PER_SALE;
            }
            
            cumulativeEarnings += currentYearEarnings;
            chartLabels.push(`Ano ${year}`);
            chartData.push(cumulativeEarnings);
        }

        kpiSales.textContent = initialSales.toLocaleString('pt-BR');
        kpiEarningsY1.textContent = formatCurrency(firstYearEarnings);
        kpiEarningsY5.textContent = formatCurrency(cumulativeEarnings);

        if (resultsSection.classList.contains('hidden')) {
            resultsSection.classList.remove('hidden');
        }

        updateChart(chartLabels, chartData);
    };

    const updateChart = (labels, data) => {
        if (earningsChart) {
            earningsChart.destroy();
        }

        const isDarkMode = document.body.classList.contains('dark-mode');
        const gridColor = isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)';
        const labelColor = isDarkMode ? '#a0a0a0' : '#6c757d';

        earningsChart = new Chart(chartCanvas, {
            type: 'line',
            data: {
                labels: labels,
                datasets: [{
                    label: 'Ganhos Acumulados',
                    data: data,
                    backgroundColor: 'rgba(29, 209, 161, 0.2)',
                    borderColor: '#1dd1a1',
                    borderWidth: 3,
                    pointBackgroundColor: '#1dd1a1',
                    pointRadius: 5,
                    tension: 0.1,
                    fill: true
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: {
                    duration: 0
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: (value) => formatCurrency(value),
                            color: labelColor
                        },
                        grid: {
                            color: gridColor
                        }
                    },
                    x: {
                        ticks: {
                            color: labelColor
                        },
                        grid: {
                            color: gridColor
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: (context) => `Total: ${formatCurrency(context.parsed.y)}`
                        }
                    }
                }
            }
        });
    };

    // --- EVENT LISTENERS ---
    followersInput.addEventListener('input', calculateAndDisplay);
    conversionSlider.addEventListener('input', calculateAndDisplay);

    talkToCreatorBtn.addEventListener('click', () => {
        const message = "Olá! Visitei a página de parceiros e tenho interesse em divulgar o Financeiro PRO. Podemos conversar?";
        const whatsappUrl = `https://wa.me/${CREATOR_WHATSAPP}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    });

    // --- INICIALIZAÇÃO ---
    calculateAndDisplay();

});