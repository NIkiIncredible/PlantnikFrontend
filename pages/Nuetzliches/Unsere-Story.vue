<template>
  <div class="space-y-24 px-6 py-12 lg:px-20 lg:py-20">
    <!-- Hero -->
    <section class="text-center space-y-4">
      <Card class="bg-[url('/images/hero-plants.jpg')] bg-cover bg-center text-white">
        <CardContent class="py-32 backdrop-brightness-50">
          <TypographyH1 class="text-5xl lg:text-6xl font-extrabold">
            Unsere Story 🌱
          </TypographyH1>
          <TypographyLead class="mt-4 max-w-2xl mx-auto">
            Von der Pflanzensucht zur ganzheitlichen Pflanzenplattform – unser Weg in kurzen Worten.
          </TypographyLead>
        </CardContent>
      </Card>
    </section>

    <Separator />

    <!-- Einstieg -->
    <section class="max-w-3xl mx-auto space-y-6">
      <TypographyH2>Wie alles begann</TypographyH2>
      <TypographyP>
        Alles fing ganz harmlos an, als mich meine Freundin mit ihrer Begeisterung für grüne Mitbewohner ansteckte.
        Schon bald wuchsen Stecklinge auf der Fensterbank, es landeten Erdmischungen auf dem Küchenboden und
        ich experimentierte mit Vermehrung bis hin zur Tissue Culture. Sogar der Gemüseanbau hat heute seinen Platz.
      </TypographyP>
      <TypographyP>
        Durch meinen Background als E-Commerce-Entwickler war der eigene Onlineshop stets zum Greifen nah.
        Doch ich wollte nicht einfach nur Pflanzen verkaufen – mein Ziel war ein Ort, an dem man
        wirklich alles findet, um Pflanzen gesund zu halten. Substrate, Dünger, Töpfe, Pflege-Tools
        und unsere eigenen Innovationen – alles aus einer Hand.
      </TypographyP>
    </section>

    <Separator />

    <!-- Timeline -->
    <section class="max-w-4xl mx-auto">
      <TypographyH2 class="text-center">Unsere Meilensteine 🕰️</TypographyH2>
      <ul class="relative border-l border-muted pl-8 mt-8 space-y-10">
        <li class="relative">
          <div class="absolute -left-4 top-0 bg-primary rounded-full w-8 h-8 flex items-center justify-center text-white">
            2019
          </div>
          <TypographyP>Erste grünen Mitbewohner, die Leidenschaft beginnt.</TypographyP>
        </li>
        <li class="relative">
          <div class="absolute -left-4 top-0 bg-primary rounded-full w-8 h-8 flex items-center justify-center text-white">
            2020
          </div>
          <TypographyP>Erste Eigenmischungen, Stecklinge und DIY-Rankhilfen.</TypographyP>
        </li>
        <li class="relative">
          <div class="absolute -left-4 top-0 bg-primary rounded-full w-8 h-8 flex items-center justify-center text-white">
            2021
          </div>
          <TypographyP>Die Idee des ganzheitlichen Pflanzen-Shops entsteht.</TypographyP>
        </li>
        <li class="relative">
          <div class="absolute -left-4 top-0 bg-primary rounded-full w-8 h-8 flex items-center justify-center text-white">
            2022
          </div>
          <TypographyP>Entwicklung & Test unserer ersten Eigenprodukte und Versandkonzepte.</TypographyP>
        </li>
        <li class="relative">
          <div class="absolute -left-4 top-0 bg-primary rounded-full w-8 h-8 flex items-center justify-center text-white">
            2023
          </div>
          <TypographyP>Launch des Onlineshops mit Substraten, Dünger & ersten Eigenmarken-Produkten.</TypographyP>
        </li>
        <li class="relative">
          <div class="absolute -left-4 top-0 bg-primary rounded-full w-8 h-8 flex items-center justify-center text-white">
            2024
          </div>
          <TypographyP>Sortiments- und Marken-Ausbau, Partnerschaften mit Gärtnereien.</TypographyP>
        </li>
      </ul>
    </section>

    <Separator />

    <!-- Eigenentwicklungen -->
    <section class="max-w-4xl mx-auto space-y-8">
      <TypographyH2 class="text-center">Unsere Eigenentwicklungen 🛠️</TypographyH2>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Moosstäbe</CardTitle>
          </CardHeader>
          <CardContent>
            <TypographyP>Stabile Rankhilfen für Moos, die optimal Feuchtigkeit regulieren.</TypographyP>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Übertöpfe</CardTitle>
          </CardHeader>
          <CardContent>
            <TypographyP>Atmungsaktive Designs, die Funktion und Ästhetik verbinden.</TypographyP>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Erdmischungen</CardTitle>
          </CardHeader>
          <CardContent>
            <TypographyP>Perfekt abgestimmt auf verschiedene Pflanzenarten und ihre Bedürfnisse.</TypographyP>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Bald: Flüssigdünger</CardTitle>
          </CardHeader>
          <CardContent>
            <TypographyP>Naturbasiert, sanft und effektiv – kommt bald in unserem Shop.</TypographyP>
          </CardContent>
        </Card>
      </div>
    </section>

    <Separator />

    <!-- Community & Zukunft -->
    <section class="max-w-3xl mx-auto space-y-8 text-center">
      <TypographyH2>Unsere Community 🤝</TypographyH2>
      <TypographyP>
        Eure Fotos, euer Feedback und eure Begeisterung treiben uns jeden Tag an.
        Ohne euch wäre unsere Story nicht möglich – danke, dass ihr Teil davon seid!
      </TypographyP>

      <Separator />

      <TypographyH2>Wohin die Reise geht 🔮</TypographyH2>
      <TypographyP>
        Wir bauen weitere Eigenprodukte, optimieren Versand & Verpackung und
        planen spannende Inhalte: Pflegevideos, Workshops und Live-Events.
        Gemeinsam mit euch schaffen wir eine Plattform, die inspiriert und verbindet.
      </TypographyP>
    </section>

    <!-- Abschluss-CTA -->
    <section class="text-center">
      <Card class="bg-secondary text-white">
        <CardContent class="py-12">
          <TypographyH2>Danke, dass du dabei bist!</TypographyH2>
          <TypographyP class="mt-2">
            Deine Pflanze wartet schon darauf, Teil unserer gemeinsamen Story zu werden.
          </TypographyP>
          <Button class="mt-4" variant="outline" href="/shop">
            Zu den Pflanzen entdecken
          </Button>
        </CardContent>
      </Card>
    </section>
  </div>
</template>

<script setup lang="ts">
// Shadcn-UI Komponentenimport

</script>
