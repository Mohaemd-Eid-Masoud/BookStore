using System.ComponentModel.DataAnnotations;

namespace BookStore.Domain.Models
{
    public abstract class Entity
    {
        [Key]
        public int Id { get; set; }
    }
}