import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { OmdbService } from '../../services/omdb';

@Component({
  selector: 'app-detalle-pelicula',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './detalle-pelicula.html'
})
export class DetallePelicula implements OnInit {
  private route = inject(ActivatedRoute);
  private omdbService = inject(OmdbService);

  pelicula: any = null;
  cargando: boolean = true;
  mensaje: string = '';

  ngOnInit(): void {
    // Captura el ID de la URL (ej. tt0133093)
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      this.cargando = false;
      this.mensaje = 'No se proporcionó un ID válido de película.';
      return;
    }

    // Petición a la API usando el endpoint con ?i=
    this.omdbService.obtenerPeliculaPorId(id).subscribe({
      next: (respuesta) => {
        this.cargando = false;
        if (respuesta.Response === 'False') {
          this.mensaje = 'No se encontraron detalles para este ID.';
          return;
        }
        this.pelicula = respuesta;
      },
      error: (err) => {
        console.error('Error al consultar por ID:', err);
        this.cargando = false;
        this.mensaje = 'Error al conectar con la API de OMDb.';
      }
    });
  }
}
